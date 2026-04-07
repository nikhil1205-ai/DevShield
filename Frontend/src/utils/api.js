import axios from "axios";

let prod=false;
let BaseURL=prod ? "https://devshield-production.up.railway.app" :"http://localhost:5000"; 

const api = axios.create({
  baseURL: BaseURL,
  withCredentials: true
});

export default api;

