export interface User {
    id: string
    name: string
    email?: string
    role: string
    phone?: string
    bio?: string
    password?: string
    createdAt?: string
}

export interface GetUsersResponse {
    data: User[]
    total: number
    page: number
    limit: number
    totalPages: number
}
