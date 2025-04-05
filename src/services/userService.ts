import { api } from "./api"

export const userService = {
    register: async (data: {
        name: string
        email: string
        bio: string
        password: string
        role: string
    }) => {
        const response = await api.post("/users", data)
        return response.data
    },
}
