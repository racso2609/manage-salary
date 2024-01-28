import axios from 'axios';
import env from '@/env';

export const apiClient = axios.create({
    baseURL: env.HOST || '',
    headers: {
        Authorization: 'ApiKey' + process?.env?.API_KEY,
    },
});

export const binanceClient = axios.create({
    baseURL: env.BINANCE_HOST || '',
    headers: {
        'X-MBX-APIKEY': env.BINANCE_API_KEY,
    },
});
