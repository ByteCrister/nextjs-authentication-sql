import Axios from 'axios';

export const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true,
    timeout: 10000,
});

axios.interceptors.request.use((config) => {
    // Example: attach CSRF token or trace header
    return config;
});

axios.interceptors.response.use(
    (res) => res,
    (err) => {
        const status = err.response?.status;
        if (status === 401) {
            // optionally redirect to sign-in on client
        }
        return Promise.reject(err);
    }
);
