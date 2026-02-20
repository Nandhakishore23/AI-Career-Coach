import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5005/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const startInterview = (data) => api.post('/interview/start', data);
export const analyzeAnswer = (data) => api.post('/interview/analyze', data);
export const endInterview = (data) => api.post('/interview/end', data);
export const getInterviewHistory = () => api.get('/interview/history');

export default api;
