import { api } from "./api"

export const authService = {
    login: async (email: string, password: string) => {
        const response = await api.post("/auth/login", { email, password })
        return response.data
    },
    requestResetCode: async (payload: { email: string }) => {
        return api.post("/auth/password-reset/request", payload);
    },

    validateResetCode: async (payload: { email: string; code: string }) => {
        return api.post("/auth/password-reset/validate", payload);
    },

    resetPassword: async (payload: { email: string; newPassword: string }) => {
        return api.patch("/auth/password-reset", payload);
    },
};