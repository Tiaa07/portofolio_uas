import axios from "axios";
import { handleApiError } from "../utils/errorHandler";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Session expired (401 Unauthorized)
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_role");
      localStorage.removeItem("otp_email");
      
      // Note: We don't do hard redirect window.location.href here 
      // because it can cause sudden logouts in other tabs.
      // The ProtectedRoute component will handle navigation if the user is no longer logged in.
    }

    // Automate global error alerts for all errors except validation (which is usually handled by forms)
    if (error.config?.skipGlobalAlert !== true) {
      handleApiError(error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;