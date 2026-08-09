import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost/vending-api/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
