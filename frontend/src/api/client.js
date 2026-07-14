import axios from "axios";

// Uses localhost during development (.env.local)
// Uses the Netlify environment variable in production.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export const predictExpenses = (data) => api.post("/predict", data);

export const getAccuracyData = () => api.get("/accuracy-data");

export const getFeatureImportance = () => api.get("/feature-importance");

export default api;