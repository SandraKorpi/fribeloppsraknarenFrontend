// HourService.js
import ApiService from "./ApiService";

const HourService = {
    async fetchUserId() {
        const token = localStorage.getItem("token");
        return ApiService.extractUserIdFromToken(token);
    },

    async addHours(hours, month, day, year, hourlyRate, vacationPay) {
        try {
            const response = await ApiService.addHours(hours, month, day, year, hourlyRate, vacationPay);
            return response;
        } catch (error) {
            throw new Error("Fel vid registrering av timmar");
        }
    },

    async fetchMonthPay(year, month) {
        try {
            const response = await ApiService.getPayForMonth(year, month);
            console.log("Månadsinkomst visas.")
            return response;
        } catch (error) {
            throw new Error("Fel vid hämtning av månadsinkomst.");
        }
    },
    async getWorkedHoursDetails(year, month) {
        try {
            const response = await ApiService.getWorkedHoursDetails(year, month); // Anropa den asynkrona metoden från ApiService
            return response;
        } catch (error) {
            throw new Error("Det gick inte att hämta detaljer om arbetade timmar");
        }
    },
    async fetchAllHours() {
        const token = localStorage.getItem("token");
        try {
            const response = await ApiService.allHours(token);
            return Array.isArray(response) ? response : Array.from(response);
        } catch (error) {
            throw new Error("Kunde inte ladda dina timmar");
        }
    },

    // Hjälpmetod för att extrahera unika månad/år
    getUniqueMonths(hours) {
        const monthsSet = new Set();

        hours.forEach((hour) => {
            const yearMonth = `${hour.year}-${hour.month}`;
            monthsSet.add(yearMonth); // Lägg till kombinationen av år och månad
        });

        // Omvandla Set till en array av objekt
        return Array.from(monthsSet).map((yearMonth) => {
            const [year, month] = yearMonth.split("-");
            return { year: parseInt(year), month: parseInt(month) };
        });
    },

    async fetchUniqueMonths() {
        try {
            const hours = await this.fetchAllHours();
            return this.getUniqueMonths(hours); // Extrahera unika månader
        } catch (error) {
            throw new Error("Kunde inte hämta unika månader");
        }
    },

    async deleteHour(year, month, day) {
        try {
            return await ApiService.deleteHour(year, month, day);
        } catch (error) {
            throw new Error("Fel vid borttagning av timmar");
        }
    },

    async deleteAllHoursForMonth(year, month) {
        try {
            const response = await ApiService.deleteAllHoursForMonth(year, month);
            return response;
        } catch (error) {
            throw new Error("Det gick inte att ta bort alla timmar för den angivna månaden");
        }
    },

    async getOneHour(year, month, day) {
        try {
            return await ApiService.getOneHour(year, month, day);
        } catch (error) {
            throw new Error("Det gick inte att hämta registrerade timmar");
        }
    },


    async updateHour (hours, month, date, year, hourlyRate, vacationPay)
    {
        try {
            return await ApiService.updateHour(hours,month,date,year,hourlyRate,vacationPay)
        } catch (error) {
            throw new Error("Det gick inte att hämta registrerade timmar");
        }
    },

    //tar in månad från kalendern och avgör här vilken termin månaden tillhör.
    async getSemesterIncome(year, month) {
        let semester;
        // Bestäm vilken termin baserat på månaden
        if (month >= 1 && month <= 6) {
            semester = "VT";
        } else if (month >= 7 && month <= 12) {
            semester = "HT";
        } else {
            throw new Error("Ogiltig månad");
        }
        try {
            return await ApiService.getSemesterIncome(year, semester);
        } catch (error) {
            console.log(`Sending semester: ${semester}`);
            throw new Error("Det gick inte att hämta terminens inkomster");
        }
    },

    async compareSemesterIncome (year, month){
        let semester;
        // Bestäm vilken termin baserat på månaden
        if (month >= 1 && month <= 6) {
            semester = "VT";
        } else if (month >= 7 && month <= 12) {
            semester = "HT";
        } else {
            throw new Error("Ogiltig månad");
        }
        try {
            console.log(`Hämtar från apiet`);
            return await ApiService.compareSemesterIncome(year, semester);
        } catch (error) {
            throw new Error("Det gick inte att hämta terminens inkomster");
        }
    },
};

export default HourService;
