import axios from 'axios';
import * as dotenv from 'dotenv';
import { generateSignature } from '@cronjobs/utils';
import { Order } from '@cronjobs/interfaces/order.d';
dotenv.config();

const HOST_BINANCE = process.env.BINANCE_HOST;
const HOST = process.env.HOST;

export const createExpense = async (url: string, query: string) => {
    const signature = generateSignature(query, process.env.BINANCE_SECRET_KEY);
    const request = await axios.get(
        `${HOST_BINANCE}/${url}?${query}&signature=${signature}`,
        { headers: { 'X-MBX-APIKEY': process.env.BINANCE_API_KEY } },
    );
    const expenses: Order[] = request?.data?.data
        .flat()
        .filter((order: any) => order.orderStatus === 'COMPLETED')
        .map((expense: any) => ({
            orderId: expense.orderNumber,
            orderType: 'P2P',
            seller: expense.counterPartNickName,
            unitPrice: expense.unitPrice,
            fiat: expense.fiat,
            asset: expense.asset,
            note: '',
            amount: expense.amount,
            date: expense.createTime,
            total: expense.totalPrice,
        }));
    const API_KEY = 'ApiKey ' + process.env.API_KEY;

    try {
        await axios.post(
            `${HOST}/api/expenses/external/json`,
            { expenses },
            { headers: { Authorization: API_KEY } },
        );
    } catch (error) {
        console.log(error?.response?.data?.message);
        console.log('failed to create expenses');
    }
    // console.log(
    //     'expenses from p2p',
    //     expenses.map((order) => order.orderId)
    // );
};

export const createEntries = async (url, query) => {
    const signature = generateSignature(query, process.env.BINANCE_SECRET_KEY);
    const request = await axios.get(
        `${HOST_BINANCE}/${url}?${query}&signature=${signature}`,
        { headers: { 'X-MBX-APIKEY': process.env.BINANCE_API_KEY } },
    );
    const entriesAndExpenses = request.data.data;
    const entries: Order[] = entriesAndExpenses
        .filter((entry) => entry.amount[0] !== '-')
        .map((entry) => ({
            orderId: entry.transactionId,
            orderType: 'C2C',
            seller: entry.orderId ?? entry.conunterpartyId,
            unitPrice: '',
            fiat: '',
            asset: entry.currency,
            note: entry.note,
            amount: entry.amount,
            date: entry.transactionTime,
            total: '',
        }));
    const expenses: Order[] = entriesAndExpenses
        .filter((expense) => expense.amount[0] === '-')
        .map((expense) => ({
            orderId: expense.transactionId,
            orderType: 'C2C',
            seller: expense.orderId ?? expense.conunterpartyId,
            unitPrice: '',
            fiat: '',
            asset: expense.currency,
            note: expense.note,
            amount: expense.amount.slice(1, expense.amount.length),
            date: expense.transactionTime,
            total: '',
        }));
    const API_KEY = 'ApiKey ' + process.env.API_KEY;
    if (expenses.length) {
        try {
            await axios.post(
                `${HOST}/api/expenses/external/json`,
                { expenses },
                { headers: { Authorization: API_KEY } },
            );
        } catch (error) {
            console.log(error?.response?.data?.message);
            console.log('fail expenses add');
        }
    }

    if (entries.length) {
        try {
            await axios.post(
                `${HOST}/api/entries/external/json`,
                { entries },
                { headers: { Authorization: API_KEY } },
            );
        } catch (error) {
            console.log(error?.response?.data?.message);
            console.log('fail entries add');
        }
    }
    // console.log(
    //     'expenses from c2c',
    //     expenses.map((order) => order.orderId)
    // );
    // console.log(
    //     'entries from c2c',
    //     entries.map((order) => order.orderId)
    // );
};
