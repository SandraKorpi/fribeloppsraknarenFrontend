// src/services/ApiService.js
import axios from 'axios';

// API URL
const API_URL = "http://localhost:5051";

//ANVÄNDAR-METODER!

// Sätt token vid varje förfrågan
const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common["Authorization"];
    }
};

// Funktion för att extrahera användar-ID från JWT-token
const extractUserIdFromToken = (token) => {
    if (!token) return null;
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload); // Decode the payload
    const jsonPayload = JSON.parse(decodedPayload);
    return jsonPayload.userId; // Eller använd det fält som innehåller användar-ID
};

//Metod för att kontrollera om användaren har en token som är giltig.
const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        const payload = token.split('.')[1];
        const decodedPayload = atob(payload);
        const jsonPayload = JSON.parse(decodedPayload);

        // Kontrollera om token har gått ut
        const currentTime = Math.floor(Date.now() / 1000); // Nuvarande tid i sekunder
        return jsonPayload.exp > currentTime; // Token är giltig om utgångstiden är i framtiden
    } catch (error) {
        console.error("Fel vid kontroll av autentisering:", error);
        return false;
    }
};

// api-anrop för att logga in och hämta JWT-token
const login = async (userName, password) => {
    const response = await axios.post(`${API_URL}/api/auth/signIn`, { userName, password });
    const token = response.data.token;
    setAuthToken(token);
    localStorage.setItem("token", token); // Spara token lokalt för framtida anrop
    return response.data;
};

//Tar bort token och skickar användaren till login sidan vid utlogg.
const logout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    window.location.href = "/";
};

//api-anrop för att regga användare
const register = async (userName, password, email) => {
    try {
        console.log("Skickar registreringsbegäran...");
        const response = await axios.post(`${API_URL}/api/auth/register`, { userName, password, email });
        console.log("Respons från servern:", response);
        return response.data;
    } catch (error) {
        console.error("Fel vid API-anrop:", error.response ? error.response.data : error.message);
        throw error; // Kasta vidare felet så att det kan hanteras i `handleRegistration`
    }
};


// HÄMTA DATA OM TIMMAR

//api-anrop för att lägga till timmar i databasen.
const addHours = async (hours, month, date, year, hourlyRate, vacationPay) => {
    const token = localStorage.getItem("token");
    const userId = extractUserIdFromToken(token); // Extrahera användar-ID från token

    // Skapa WorkedHoursDto objektet och skicka med användar-ID
    const workedHoursDto = {
        hours,
        month,
        date,
        year,
        hourlyRate,
        vacationPay,
        userId // Lägg till användar-ID här
    };

    const response = await axios.post(`${API_URL}/api/worked-hours/addHours`, workedHoursDto, {
        headers: {
            Authorization: `Bearer ${token}`, // Skicka med token för autentisering
            // }
        }});
    return response.data;
};

//api-anrop för att hämta totala arbetstimmarna.
const allHours = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/worked-hours/allTotal`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log("API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Fel vid hämtning", error);
        throw new Error("Det gick inte att hämta alla timmar.");
    }
};

//api-anrop för att hämta antalet timmar för ett arbetspass.
const getOneHour = async (year, month, date) =>{
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/worked-hours/getByDate/year/${year}/month/${month}/date/${date}`, {
            headers: {
                Authorization: `Bearer ${token}`}
        });
        console.log("API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Fel vid hämtning", error);
        throw new Error("Det gick inte att hämta timmarna.");
    }
};

//Api-anrop för att få intjänade kr för en månad.
const getPayForMonth = async (year, month) => {
    try{
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/worked-hours/monthly-income/${year}/${month}`,
            { headers: {
                    Authorization: `Bearer ${token}`}
            });
        console.log("API Response monthlyincome:", response.data);
        return response.data;
    } catch (error) {
        console.error("Fel vid hämtning", error);
        throw new Error("Det gick inte att månadsinkomst");
    }
};

const getWorkedHoursDetails = async (year, month) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/worked-hours/worked-hours-details/${year}/${month}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log("API svar:", response.data);
        return response.data;
    } catch (error) {
        console.error("Fel vid hämtning av detaljer för arbetade timmar", error);
        throw new Error("Det gick inte att hämta detaljer om arbetade timmar");
    }
};

//api-anrop för att radera en timme.
const deleteHour = async ( year, month, date) =>{
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${API_URL}/api/worked-hours/delete/year/${year}/month/${month}/date/${date}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        console.log("API Response:", response.data);
        return response.data; } catch (error) {
        console.error("Fel vid adering", error)
        throw new error("Det gick inte att radera timmarna.")
    }
};

//api-anrop för att uppdatera en timme.
const updateHour = async (hours, month, date, year, hourlyRate, vacationPay) =>{

    try {
        const token = localStorage.getItem("token");
        const userId = extractUserIdFromToken(token); // Extrahera användar-ID från token, ska inte tas in av user.

        // Skapa WorkedHoursDto objektet och skicka med användar-ID
        const workedHoursDto = {
            hours,
            month,
            date,
            year,
            hourlyRate,
            vacationPay,
            userId // Lägg till användar-ID här
        };
        const response = await axios.put(`${API_URL}/api/worked-hours/year/${year}/month/${month}/date/${date}`, workedHoursDto,{
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        console.log("API Response:", response.data);
        console.log("API Response:", response.data);
        return response.data; } catch (error) {
        console.error("Fel vid uppdatering", error)
        throw new error("Det gick inte att uppdatera timmen.")
    }}
// API-anrop för att hämta semesterinkomst baserat på år och semester
const getSemesterIncome = async (year, semester) => {
    try {
        const token = localStorage.getItem("token"); // Hämta token från localStorage
        const response = await axios.get(`${API_URL}/api/worked-hours/semester-income/${year}/${semester}`, {
            headers: {
                Authorization: `Bearer ${token}` // Skicka med token för autentisering
            }
        });
        console.log("API Response:", response.data);
        return response.data; // Returnera den beräknade semesterinkomsten
    } catch (error) {
        console.error("Fel vid hämtning av semesterinkomst:", error);
        throw new Error("Det gick inte att hämta semesterinkomst.");
    }

}
const compareSemesterIncome = async (year, semesterType) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/worked-hours/compare-income/${year}/${semesterType}`, {
            headers: {
                Authorization: `Bearer ${token}` // Skicka med token för autentisering
            }
        });
        return response.data;
    } catch (error) {
        console.error("Fel vid hämtning av compareincome", error);
        throw error;
    }
}
const getUserForUser = async () => {
    try {
        // Hämta token från localStorage
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("Token saknas.");
        }
        const response = await axios.get(`${API_URL}/api/users/getUser`, {
            headers: {
                Authorization: `Bearer ${token}`, }
        });
        console.log("Hämtad användare:", response.data);
        return response.data;
    } catch (error) {
        console.error("Fel vid hämtning av användare:", error.response ? error.response.data : error.message);
        throw new Error("Det gick inte att hämta användaren.");
    }}

const updateUser = async (userDto) => {
    try {
        const token = localStorage.getItem("token");
        const userId = extractUserIdFromToken(token); // Extrahera användarens ID från token
        if (!userId) throw new Error("Användar-ID kunde inte hittas i token.");

        const response = await axios.put(`${API_URL}/api/users/${userId}`, userDto, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Uppdaterad användare:", response.data);
        return response.data;
    } catch (error) {
        console.error("Fel vid uppdatering av användare:", error.response ? error.response.data : error.message);
        throw new Error("Det gick inte att uppdatera användaren.");
    }
};

export default {
    login,
    register,
    addHours,
    setAuthToken,
    allHours,
    extractUserIdFromToken,
    deleteHour,
    getOneHour,
    getPayForMonth,
    updateHour,
    getSemesterIncome,
    compareSemesterIncome,
    getWorkedHoursDetails,
    getUserForUser,
    updateUser,
    logout,
    isAuthenticated
};