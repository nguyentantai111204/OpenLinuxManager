import axios from 'axios';

// Create a configured axios instance
export const axiosClient = axios.create({
    baseURL: '', // Uses relative path (proxy)
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor to unwrap the data
axiosClient.interceptors.response.use(
    (response) => {
        // If the response follows the { success: true, data: ... } pattern
        if (response.data && typeof response.data === 'object' && response.data.success === true && 'data' in response.data) {
            return {
                ...response,
                data: response.data.data
            };
        }
        return response;
    },
    (error) => {
        // Handle errors globally if needed
        return Promise.reject(error);
    }
);
