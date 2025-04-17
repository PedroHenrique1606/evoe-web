import axios from "axios"

export const api = axios.create({
    baseURL: "https://petrus-api.onrender.com", 
})
