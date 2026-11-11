import ApiService from "./ApiService";

const UserService = {
    async fetchUserDetails() {
        return ApiService.getUserForUser();
    },

    async updateUserDetails(userName, email) {
        return ApiService.updateUser(userName, email);
    },

    async updatePassword(currentPassword, newPassword, confirmPassword) {
        if (!currentPassword || !newPassword || !confirmPassword) {
            throw new Error("Alla lösenordsfält måste fyllas i.");
        }
        if (newPassword !== confirmPassword) {
            throw new Error("De nya lösenorden matchar inte.");
        }
        return ApiService.changePassword(currentPassword, newPassword, confirmPassword);
    },

    async deleteAccount() {
        return ApiService.deleteAccount();
    },
};

export default UserService;
