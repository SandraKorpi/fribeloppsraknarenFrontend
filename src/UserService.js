import ApiService from "./ApiService";

const UserService = {
    async fetchUserId() {
        const token = localStorage.getItem("token");
        return ApiService.extractUserIdFromToken(token);
    },

    async fetchUserDetails() {
        const token = localStorage.getItem("token");
        try {
            const response = await ApiService.getUserForUser(token);
            return response;
        } catch (error) {
            throw new Error("Kunde inte hämta användardetaljer.");
        }
    },
    async updateUserDetails(userName, email) {
        try {
            const response = await ApiService.updateUser(userName, email);
            return response;
        } catch (error) {
            throw new Error("Kunde inte uppdatera användardetaljer.");
        }
    },
    async updatePassword(currentPassword, newPassword, confirmPassword) {
        try {
            // Kontrollera att alla lösenord är ifyllda innan vi skickar till API
            if (!currentPassword || !newPassword || !confirmPassword) {
                throw new Error("Alla lösenord måste fyllas i.");
            }

            // Om lösenorden inte matchar, visa ett felmeddelande
            if (newPassword !== confirmPassword) {
                throw new Error("De nya lösenorden matchar inte.");
            }

            const response = await ApiService.changePassword(currentPassword, newPassword, confirmPassword);
            return response;
        } catch (error) {
            console.error("Fel vid uppdatering av lösenord:", error.message);
            throw new Error("Kunde inte uppdatera lösenord.");
        }
    }
};

    export default UserService;
