import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

// used when page reloads..
axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem('token');

