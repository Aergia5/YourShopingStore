import axios from "axios"

const BASE_URL =
  import.meta.env.MODE === "development"
    ? (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000")
    : (import.meta.env.VITE_BACKEND_URL || "http://localhost:5000")

const API = axios.create({
  baseURL: BASE_URL,
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


export { BASE_URL }
export default API
