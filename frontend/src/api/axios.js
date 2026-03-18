import axios from 'axios';

// Use environment variable, fallback to localhost for development
export const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '');

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // Important for cookies/sessions
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