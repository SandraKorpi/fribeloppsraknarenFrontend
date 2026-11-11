// HourService.js
import ApiService from "./ApiService";

const HourService = {
    async fetchUserId() {
        return ApiService.extractUserIdFromToken(localStorage.getItem("token"));
    },

    async addHours(hours, month, day, year, hourlyRate, vacationPay) {
        try {
            const response = await ApiService.addHours(hours, month, day, year, hourlyRate, vacationPay);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async fetchMonthPay(year, month) {
        try {
            const response = await ApiService.getPayForMonth(year, month);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getWorkedHoursDetails(year, month) {
        try {
            const response = await ApiService.getWorkedHoursDetails(year, month); // Anropa den asynkrona metoden från ApiService
            return response;
        } catch (error) {
            throw error;
        }
    },
    async fetchAllHours() {
        try {
            const response = await ApiService.allHours();
            return Array.isArray(response) ? response : Array.from(response);
        } catch (error) {
            throw error;
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
            throw error;
        }
    },

    async deleteHour(year, month, day) {
        try {
            return await ApiService.deleteHour(year, month, day);
        } catch (error) {
            throw error;
        }
    },

    async deleteAllHoursForMonth(year, month) {
        try {
            const response = await ApiService.deleteAllHoursForMonth(year, month);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getOneHour(year, month, day) {
        try {
            return await ApiService.getOneHour(year, month, day);
        } catch (error) {
            throw error;
        }
    },


    async updateHour (hours, month, date, year, hourlyRate, vacationPay)
    {
        try {
            return await ApiService.updateHour(hours,month,date,year,hourlyRate,vacationPay)
        } catch (error) {
            throw error;
        }
    },

};

export default HourService;
