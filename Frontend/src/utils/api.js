import axios from "axios";

const BaseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BaseURL,
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred.";
      
    const event = new CustomEvent("api-error", { detail: message });
    window.dispatchEvent(event);
    
    return Promise.reject(error);
  }
);

export default api;
