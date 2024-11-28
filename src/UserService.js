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
    async updateUserDetails(updatedUserDetails) {
        const token = localStorage.getItem("token");
        try {
            const userId = await this.fetchUserId(); // Hämtar användarens ID från token
            const response = await ApiService.updateUser(userId, updatedUserDetails, token);
            return response;
        } catch (error) {
            throw new Error("Kunde inte uppdatera användardetaljer.");
        }
    },
    async updatePassword(currentPassword, newPassword, confirmPassword) {
        try {
            console.log("Current Password-user:", currentPassword);
            console.log("New Password-userservice:", newPassword);
            console.log("Confirm Password:", confirmPassword);
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
