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
    }
};

export default UserService;
