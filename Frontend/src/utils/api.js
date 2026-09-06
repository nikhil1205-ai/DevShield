import axios from "axios";

const BaseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BaseURL,
  withCredentials: true
});

export default api;
