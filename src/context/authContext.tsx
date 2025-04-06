import { User } from "@/interfaces/User"
import { createContext, useContext, useEffect, useState } from "react"

type AuthContextType = {
    user: User | null
    access_token: string | null
    login: (token: string, user: User) => void
    logout: () => void
}

const AuthContext = createContext({} as AuthContextType)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [access_token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedToken = localStorage.getItem("access_token")
        const storedUser = localStorage.getItem("user")

        if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
        }

        setLoading(false)
    }, [])

    const login = (access_token: string, user: User) => {
        localStorage.setItem("access_token", access_token)
        localStorage.setItem("user", JSON.stringify(user))
        setToken(access_token)
        setUser(user)
    }

    const logout = () => {
        localStorage.clear()
        setToken(null)
        setUser(null)
    }

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <p className="text-gray-500 font-medium">Carregando...</p>
            </div>
        )
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                access_token,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
export const useAuthToken = () => useAuth().access_token
export const useAuthUser = () => useAuth().user
export const useAuthLogout = () => useAuth().logout
