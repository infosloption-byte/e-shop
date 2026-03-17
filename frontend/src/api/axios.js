import axios from 'axios';

export const BASE_URL = 'http://127.0.0.1:8000'; // Export this

const api = axios.create({
    baseURL: `${BASE_URL}/api`,
});

// Add a request interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;