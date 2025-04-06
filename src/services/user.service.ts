import { GetUsersResponse, User } from "@/interfaces/User"
import { api } from "./api"
import { AxiosError } from "axios"

type CreateUserPayload = {
    name: string
    email: string
    phone?: string | null
    bio: string
    password: string
    role: string
}

type UpdateUserPayload = {
    name: string
    email: string
    phone?: string | null
    bio: string
    password?: string
    role: string
}

export const userService = {
    register: async (data: CreateUserPayload): Promise<User> => {
        const response = await api.post("/users", data)
        return response.data
    },

    createByAuth: async (data: CreateUserPayload): Promise<User> => {
        const token = localStorage.getItem("access_token")
        const response = await api.post("/users/create-by-auth", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data
    },

    update: async (id: string, data: UpdateUserPayload): Promise<User> => {
        const token = localStorage.getItem("access_token")
        const response = await api.put(`/users/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data
    },
    
    updatePassword: async (id: string, password: string): Promise<void> => {
        const token = localStorage.getItem("access_token")
        await api.patch(`/users/${id}/password`, { password }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    }
}

export const getUserService = {
    getAll: async (page = 1, limit = 10, q = ""): Promise<GetUsersResponse> => {
        const token = localStorage.getItem("access_token")
        const response = await api.get("/users", {
            params: { page, limit, q },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data
    },

    getById: async (id: string): Promise<User> => {
        const token = localStorage.getItem("access_token")
        const response = await api.get(`/users/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data
    },

    delete: async (id: string): Promise<void> => {
        const token = localStorage.getItem("access_token")

        try {
            await api.delete(`/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>
            const errorMessage =
                axiosError.response?.data?.message || "Erro ao deletar usuário."
            throw new Error(errorMessage)
        }
    },

}
