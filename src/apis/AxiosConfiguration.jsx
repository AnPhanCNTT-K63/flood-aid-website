import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      console.log("No token found in localStorage");
      // Redirect using window.location if not authorized
      window.location.href = "/unauthorized";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
