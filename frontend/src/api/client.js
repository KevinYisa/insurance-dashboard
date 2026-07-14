import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

export const predictExpenses = (data) => api.post('/predict', data);
export const getAccuracyData = () => api.get('/accuracy-data');
export const getFeatureImportance = () => api.get('/feature-importance');

export default api;