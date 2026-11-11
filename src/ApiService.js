// src/ApiService.js
import axios from 'axios';

// Adressen till backend. Sätts i .env (REACT_APP_API_URL) för test och produktion.
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const TOKEN_KEY = "token";

// All åtkomst till den sparade tokenen går via den här. I iOS-appen kan den bytas mot
// säker lagring (Keychain) utan att resten av koden behöver ändras.
const tokenStore = {
    get() {
        try {
            return localStorage.getItem(TOKEN_KEY);
        } catch (error) {
            return null;
        }
    },
    set(token) {
        try {
            localStorage.setItem(TOKEN_KEY, token);
        } catch (error) {
            // Lagring kan vara avstängd, till exempel i privat läge. Då gäller inloggningen bara tills sidan laddas om.
        }
    },
    clear() {
        try {
            localStorage.removeItem(TOKEN_KEY);
        } catch (error) {
            // Inget att rensa.
        }
    },
};

const api = axios.create({
    baseURL: API_URL,
    timeout: 15000,
});

// Lägger automatiskt på token på varje anrop.
api.interceptors.request.use((config) => {
    const token = tokenStore.get();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Om servern säger att inloggningen är ogiltig eller har gått ut skickas användaren till inloggningen.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response ? error.response.status : null;
        const url = (error.config && error.config.url) || "";
        const isAuthCall = url.includes("/api/auth/signIn") || url.includes("/api/auth/register");

        if (status === 401 && !isAuthCall && tokenStore.get()) {
            tokenStore.clear();
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

// Gör om ett axios-fel till ett Error med ett meddelande som går att visa för användaren.
// Servern skickar { message } eller { message, errors: { fält: text } }.
const toError = (error, fallback) => {
    if (!error || !error.isAxiosError) {
        return error instanceof Error ? error : new Error(fallback);
    }

    let message = fallback;
    const data = error.response ? error.response.data : null;

    if (!error.response) {
        message = "Kunde inte nå servern. Kontrollera din anslutning och försök igen.";
    } else if (data && typeof data === "object") {
        if (data.errors && typeof data.errors === "object" && Object.keys(data.errors).length > 0) {
            message = Object.values(data.errors).join(" ");
        } else if (data.message) {
            message = data.message;
        }
    }

    const result = new Error(message);
    result.status = error.response ? error.response.status : null;
    return result;
};

// JWT använder base64url, som atob() inte klarar utan omvandling.
const decodePayload = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    return JSON.parse(atob(padded));
};

//ANVÄNDAR-METODER!

// Funktion för att extrahera användar-ID från JWT-token. Används bara för att visa data i klienten,
// servern litar aldrig på det här värdet utan läser alltid användaren ur tokenen själv.
const extractUserIdFromToken = (token) => {
    if (!token) return null;
    try {
        return decodePayload(token).userId;
    } catch (error) {
        return null;
    }
};

//Metod för att kontrollera om användaren har en token som är giltig.
const isAuthenticated = () => {
    const token = tokenStore.get();
    if (!token) return false;

    try {
        const currentTime = Math.floor(Date.now() / 1000); // Nuvarande tid i sekunder
        return decodePayload(token).exp > currentTime; // Token är giltig om utgångstiden är i framtiden
    } catch (error) {
        return false;
    }
};

// api-anrop för att logga in och hämta JWT-token
const login = async (userName, password) => {
    try {
        const response = await api.post("/api/auth/signIn", { userName, password });
        tokenStore.set(response.data.token); // Spara token lokalt för framtida anrop
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 429) {
            const tooMany = new Error("För många inloggningsförsök. Vänta en stund och försök igen.");
            tooMany.status = 429;
            throw tooMany;
        }
        if (error.response && (error.response.status === 401 || error.response.status === 400)) {
            const wrong = new Error("Fel användarnamn eller lösenord");
            wrong.status = error.response.status;
            throw wrong;
        }
        throw toError(error, "Det gick inte att logga in.");
    }
};

//Tar bort token och skickar användaren till login sidan vid utlogg.
const logout = () => {
    tokenStore.clear();
    window.location.href = "/";
};

//api-anrop för att regga användare
const register = async (userName, password, email) => {
    try {
        const response = await api.post("/api/auth/register", { userName, password, email });
        return response.data;
    } catch (error) {
        throw toError(error, "Det gick inte att registrera kontot.");
    }
};

// Raderar användarens konto och all data. Appen måste erbjuda det enligt App Stores regler.
const deleteAccount = async () => {
    try {
        await api.delete("/api/users/me");
        tokenStore.clear();
    } catch (error) {
        throw toError(error, "Det gick inte att radera kontot.");
    }
};


// HÄMTA DATA OM TIMMAR

//api-anrop för att lägga till timmar i databasen. Användaren bestäms av servern utifrån inloggningen.
const addHours = async (hours, month, date, year, hourlyRate, vacationPay) => {
    try {
        const workedHoursDto = { hours, month, date, year, hourlyRate, vacationPay };
        const response = await api.post("/api/worked-hours/addHours", workedHoursDto);
        return response.data;
    } catch (error) {
        throw toError(error, "Det gick inte att spara timmarna.");
    }
};

//api-anrop för att hämta totala arbetstimmarna.
const allHours = async () => {
    try {
        const response = await api.get("/api/worked-hours/allTotal");
        return response.data;
    } catch (error) {
        throw toError(error, "Det gick inte att hämta alla timmar.");
    }
};

//api-anrop för att hämta antalet timmar för ett arbetspass.
const getOneHour = async (year, month, date) => {
    try {
        const response = await api.get(`/api/worked-hours/getByDate/year/${year}/month/${month}/date/${date}`);
        return response.data;
    } catch (error) {
        throw toError(error, "Det gick inte att hämta timmarna.");
    }
};

//Api-anrop för att få intjänade kr för en månad.
const getPayForMonth = async (year, month) => {
    try {
        const response = await api.get(`/api/worked-hours/monthly-income/${year}/${month}`);
        return response.data;
    } catch (error) {
        throw toError(error, "Det gick inte att hämta månadsinkomsten.");
    }
};

const getWorkedHoursDetails = async (year, month) => {
    try {
        const response = await api.get(`/api/worked-hours/worked-hours-details/${year}/${month}`);
        return response.data;
    } catch (error) {
        throw toError(error, "Det gick inte att hämta detaljer om arbetade timmar.");
    }
};

//api-anrop för att radera en timme.
const deleteHour = async (year, month, date) => {
    try {
        const response = await api.delete(`/api/worked-hours/delete/year/${year}/month/${month}/date/${date}`);
        return response.data;
    } catch (error) {
        throw toError(error, "Det gick inte att radera timmarna.");
    }
};

const deleteAllHoursForMonth = async (year, month) => {
    try {
        const response = await api.delete(`/api/worked-hours/year/${year}/month/${month}`);
        return response.data;
    } catch (error) {
        throw toError(error, "Det gick inte att radera alla timmar för den valda månaden.");
    }
};

//api-anrop för att uppdatera en timme.
const updateHour = async (hours, month, date, year, hourlyRate, vacationPay) => {
    try {
        const workedHoursDto = { hours, month, date, year, hourlyRate, vacationPay };
        const response = await api.put(`/api/worked-hours/year/${year}/month/${month}/date/${date}`, workedHoursDto);
        return response.data;
    } catch (error) {
        throw toError(error, "Det gick inte att uppdatera timmen.");
    }
};

// API-anrop för att hämta semesterinkomst baserat på år och semester
const getSemesterIncome = async (year, semester) => {
    try {
        const response = await api.get(`/api/worked-hours/semester-income/${year}/${semester}`);
        return response.data;
    } catch (error) {
        throw toError(error, "Det gick inte att hämta semesterinkomst.");
    }
};

const compareSemesterIncome = async (year, semesterType) => {
    try {
        const response = await api.get(`/api/worked-hours/compare-income/${year}/${semesterType}`);
        return response.data;
    } catch (error) {
        throw toError(error, "Det gick inte att jämföra inkomsten med fribeloppet.");
    }
};

// Metod för att hämta termin baserat på månad och år (gemensamt fribelopp, ersatt av study-periods nedan).
const getSemesterDetails = async (year, month) => {
    try {
        const response = await api.get(`/api/semester/${month}/${year}`);
        return response.data;
    } catch (error) {
        throw toError(error, "Det gick inte att hämta semesterdata.");
    }
};


// FRIBELOPP: antal studieveckor och studietakt per kalenderhalvår

// Hämtar användarens veckor och studietakt för halvåret. Returnerar null om de inte är ifyllda än.
const getStudyPeriod = async (year, semesterType) => {
    try {
        const response = await api.get(`/api/study-periods/${year}/${semesterType}`);
        return response.status === 204 ? null : response.data;
    } catch (error) {
        throw toError(error, "Det gick inte att hämta dina studieuppgifter.");
    }
};

// Sparar veckor (1-26), studietakt (100, 75 eller 50) och eventuellt eget fribelopp från CSN:s beslut.
const saveStudyPeriod = async (year, semesterType, { weeks, studyRate, fribeloppOverride }) => {
    try {
        const response = await api.put(`/api/study-periods/${year}/${semesterType}`, {
            weeks,
            studyRate,
            fribeloppOverride: fribeloppOverride === undefined ? null : fribeloppOverride,
        });
        return response.data;
    } catch (error) {
        throw toError(error, "Det gick inte att spara dina studieuppgifter.");
    }
};

// Hämtar inkomst, fribelopp, vad som är kvar eller överskrider och uppskattad minskning av studiemedlet.
const getFribeloppStatus = async (year, semesterType) => {
    try {
        const response = await api.get(`/api/worked-hours/fribelopp-status/${year}/${semesterType}`);
        return response.data;
    } catch (error) {
        throw toError(error, "Det gick inte att hämta fribeloppet.");
    }
};


// KONTO

const getUserForUser = async () => {
    try {
        const response = await api.get("/api/users/getUser");
        return response.data;
    } catch (error) {
        throw toError(error, "Det gick inte att hämta användaren.");
    }
};

const updateUser = async (userName, email) => {
    try {
        const userId = extractUserIdFromToken(tokenStore.get()); // Används bara för att bygga adressen, servern kontrollerar att det är ditt eget id.
        if (!userId) throw new Error("Du behöver logga in igen.");

        const response = await api.put(`/api/users/${userId}`, { userName, email });

        // Användarnamnet ingår i tokenen, så servern skickar en ny när det ändras.
        if (response.data.token) {
            tokenStore.set(response.data.token);
        }
        return response.data;
    } catch (error) {
        throw toError(error, "Det gick inte att uppdatera användaren.");
    }
};

const changePassword = async (currentPassword, newPassword, confirmPassword) => {
    if (newPassword !== confirmPassword) {
        throw new Error("De nya lösenorden matchar inte.");
    }
    try {
        const response = await api.put("/api/auth/change-password", {
            currentPassword,
            newPassword,
            confirmPassword,
        });
        return response.data;
    } catch (error) {
        throw toError(error, "Det gick inte att ändra lösenordet.");
    }
};


export default {
    login,
    register,
    addHours,
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
    isAuthenticated,
    changePassword,
    deleteAllHoursForMonth,
    getSemesterDetails,
    getStudyPeriod,
    saveStudyPeriod,
    getFribeloppStatus,
    deleteAccount,
};
