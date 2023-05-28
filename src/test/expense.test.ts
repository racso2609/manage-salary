require('dotenv').config();
import { beforeEach, describe, expect, test } from 'vitest';
import request = require('supertest');
import { HOST, login, signup } from './utils';
import databaseConnection from 'src/db';
import mongoose from 'mongoose';
import { User } from 'src/models/userModel';
import { expenseInterface } from 'src/models/expenseModel';

interface Expense extends expenseInterface {
    _id: string;
}

declare module 'vitest' {
    export interface TestContext {
        category: { name: string; _id: string };
        token: string;
        db?: typeof mongoose;
        expenses: Expense[];
        apiKey: string;
    }
}

describe('Expenses', () => {
    const userData = {
        email: 'oscaremiliolugo.dev@gmail.com',
        password: '26092002Aa*',
    };

    beforeEach(async (context) => {
        if (process.env.NODE_ENV === 'test') {
            context.db = await databaseConnection();
            await context.db.connection.db.dropDatabase();
            console.log('db deleted');
        }
        let response = await signup(userData);
        expect(response.statusCode).toBe(201);

        const user = await User.findOne({ email: userData.email });
        response = await request(HOST)
            .get(`/api/auth/verify-email/${user.emailVerificationCode}`)
            .send();
        expect(response.statusCode).toBe(302);

        response = await login(userData);

        expect(response.statusCode).toBe(200);
        context.token = `Bearer ${response._body.Token}`;

        response = await request(HOST)
            .post('/api/categories')
            .send({ name: 'test' })
            .set({ Authorization: context.token });

        expect(response.statusCode).toBe(200);
        const categories = await request(HOST)
            .get('/api/categories')
            .send()
            .set({ Authorization: context.token });
        expect(response.statusCode).toBe(200);
        context.category = categories._body.categories[0];

        response = await request(HOST)
            .get(`/api/auth/create-api-key`)
            .send(userData)
            .set({ Authorization: context.token });

        expect(response.statusCode).toBe(200);
        expect(response._body.apiKey).toBeTruthy;
        context.apiKey = 'ApiKey ' + response._body.apiKey;
    });

    test('should revert: create expense Missing data', async ({
        category,
        token,
    }) => {
        const expense = {
            category: category._id,
            description: 'Hola',
        };

        const response = await request(HOST)
            .post('/api/expenses')
            .send(expense)

            .set({ Authorization: token });
        expect(response.statusCode).toBe(400);
        expect(response._body.message).toBe('Missing Data!');
    });
    test('create expense', async ({ category, token }) => {
        const expense = {
            amount: 100,
            category: category._id,
            description: 'Hola',
        };

        const response = await request(HOST)
            .post('/api/expenses')
            .send(expense)
            .set({ Authorization: token });

        expect(response.statusCode).toBe(200);
        expect(response._body.expense).toBeTruthy();
        expect(response._body.status).toBe('success');
    });

    test('create expenses from json', async ({ token }) => {
        const jsonFromBinanceCSV = [
            {
                orderId: 382620441,
                orderType: 'C2C',
                seller: undefined,
                unitPrice: '',
                fiat: '',
                asset: 'USDT',
                note: '',
                amount: '3',
                date: 1677683497643,
                total: '',
            },
            {
                orderId: 382620442,
                orderType: 'C2C',
                seller: undefined,
                unitPrice: '',
                fiat: '',
                asset: 'USDT',
                note: '',
                amount: '5',
                date: 1677683119163,
                total: '',
            },
            {
                orderId: 382620442,
                orderType: 'C2C',
                seller: undefined,
                unitPrice: '',
                fiat: '',
                asset: 'USDT',
                note: '',
                amount: '179.52',
                date: 1677681829053,
                total: '',
            },
        ];
        let response = await request(HOST)
            .post('/api/expenses/json')
            .send({ expenses: jsonFromBinanceCSV })
            .set({ Authorization: token });

        expect(response.statusCode).toBe(200);
        expect(response._body.status).toBe('success');
        response = await request(HOST)
            .get(`/api/expenses?page=${0}&limit=${20}`)
            .set({ Authorization: token });
        expect(response.statusCode).toBe(200);
        expect(response._body.expends.length).toBe(2);
    });
    test('create expense from json with apiKey ', async ({ apiKey, token }) => {
        const jsonFromBinanceCSV = [
            {
                orderId: 382620441,
                orderType: 'C2C',
                seller: undefined,
                unitPrice: '',
                fiat: '',
                asset: 'USDT',
                note: '',
                amount: '3',
                date: 1677683497643,
                total: '',
            },
            {
                orderId: 382620442,
                orderType: 'C2C',
                seller: undefined,
                unitPrice: '',
                fiat: '',
                asset: 'USDT',
                note: '',
                amount: '5',
                date: 1677683119163,
                total: '',
            },
            {
                orderId: 382620442,
                orderType: 'C2C',
                seller: undefined,
                unitPrice: '',
                fiat: '',
                asset: 'USDT',
                note: '',
                amount: '179.52',
                date: 1677681829053,
                total: '',
            },
        ];
        let response = await request(HOST)
            .post('/api/expenses/external/json')
            .send({ expenses: jsonFromBinanceCSV })
            .set({ Authorization: apiKey });

        expect(response.statusCode).toBe(200);
        expect(response._body.status).toBe('success');
        response = await request(HOST)
            .get(`/api/expenses?page=${0}&limit=${20}`)
            .set({ Authorization: token });
        expect(response.statusCode).toBe(200);
        expect(response._body.expends.length).toBe(2);
    });
    describe('work with expenses', () => {
        beforeEach(async (context) => {
            context.expenses = [];
            for (let i = 0; i < 21; i++) {
                const expense = {
                    amount: 100,
                    category: context.category._id,
                    description: `Hola ${i}`,
                };

                const response = await request(HOST)
                    .post('/api/expenses')
                    .send(expense)
                    .set({ Authorization: context.token });
                context.expenses.push(response._body.expense);
            }
        });
        test('get expense', async ({ expenses, token }) => {
            const response = await request(HOST)
                .get(`/api/expenses/expense/${expenses[0]._id}`)
                .send()
                .set({ Authorization: token });
            expect(response.statusCode).toBe(200);
            expect(response._body.expend._id).toBe(expenses[0]._id);
        });
        test('get expenses', async ({ token }) => {
            let response = await request(HOST)
                .get(`/api/expenses?page=${0}&limit=${20}`)
                .set({ Authorization: token });
            expect(response.statusCode).toBe(200);
            expect(response._body.expends.length).toBe(20);

            response = await request(HOST)
                .get(`/api/expenses?page=${1}&limit=${20}`)
                .set({ Authorization: token });

            expect(response.statusCode).toBe(200);
            expect(response._body.expends.length).toBe(1);
        });
        test('delete expenses', async ({ token, expenses }) => {
            let response = await request(HOST)
                .delete(`/api/expenses/expense/${expenses[0]._id}`)
                .set({ Authorization: token });
            expect(response.statusCode).toBe(200);
            response = await request(HOST)
                .get(`/api/expenses/expense/${expenses[0]._id}`)
                .send()
                .set({ Authorization: token });
            expect(response._body.expend).toBeFalsy;
        });
        test('update expenses', async ({ expenses, token }) => {
            const response = await request(HOST)
                .put(`/api/expenses/expense/${expenses[0]._id}`)
                .send({ description: 'test' })
                .set({ Authorization: token });

            expect(response.statusCode).toBe(200);
            expect(response._body.expense.description).toBe('test');
            expect(response._body.expense.amount).toBe(expenses[0].amount);
            expect(response._body.expense.category).toBe(expenses[0].category);
        });
    });
});
