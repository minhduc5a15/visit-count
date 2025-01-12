import axios from 'axios';

const baseURL = 'https://minhduc5a15-api.vercel.app';

const API_KEY = process.env.API_KEY;

export const axiosInstance = axios.create({
    baseURL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
    },
});
