require('dotenv').config();
import { beforeEach, describe, expect, test } from 'vitest';
import request = require('supertest');
import databaseConnection from '../src/db';

import { vi } from 'vitest';
import { HOST, signup } from './utils';

declare module 'vitest' {
    export interface TestContext {
        db?: typeof import('mongoose');
        forgotData?: { email: string };
        newPassword?: string;
        token: string;
    }
}

describe('testing-server-routes', () => {
    const userData = {
        email: 'oscaremiliolugo.dev@gmail.com',
        password: '26092002Aa*',
    };

    beforeEach(async (context) => {
        if (process.env.NODE_ENV === 'test') {
            context.db = await databaseConnection();
            await context?.db?.connection.db.dropDatabase();
            console.log('db deleted');
        }
    });

    test('POST /login - fail user dont exist', async () => {
        const response = await request(HOST)
            .post(`/api/auth/login`)
            .send(userData);
        expect(response.statusCode).toBe(404);
        expect(response._body.message).toBe(
            'User with this email does not exist!',
        );
    });
    test('POST /signup - create user', async () => {
        const userSignup = { ...userData, phone: undefined };
        const response = await request(HOST)
            .post(`/api/auth/signup`)
            .send(userSignup);

        expect(response._body.status).toBe('success');
        expect(response._body.user[0].email).toBe(userSignup.email);
        expect(response._body.user.phone).toBe(userSignup.phone);
    });

    describe('Complete auth process', () => {
        beforeEach(async () => {
            const userSignup = { ...userData, phone: undefined };
            const response = await signup(userData);

            expect(response._body.status).toBe('success');
            expect(response._body.user[0].email).toBe(userSignup.email);
            expect(response._body.user.phone).toBe(userSignup.phone);
        });
        test('revert: Email already taken Post/ signup create user', async () => {
            const userSignup = { ...userData, phone: undefined };
            const response = await request(HOST)
                .post(`/api/auth/signup`)
                .send(userSignup);

            expect(response._body.status).toBe('fail');
            expect(response._body.message).toBe('Email already taken');
            expect(response.statusCode).toBe(400);
        });

        test('Post /login should revet not verified', async () => {
            const response = await request(HOST)
                .post(`/api/auth/login`)
                .send(userData);
            expect(response.statusCode).toBe(400);
            expect(response._body.message).toBe(
                'Your email has not been verified yet!',
            );
        });
        test('Post /verify should verify', async () => {
            let user = await User.findOne({ email: userData.email });
            const response = await request(HOST)
                .get(`/api/auth/verify-email/${user.emailVerificationCode}`)
                .send();
            expect(response.statusCode).toBe(302);
            user = await User.findOne({ email: userData.email });
            expect(user.emailVerified);
        });

        test('Post /verify should revert Code validation fail', async () => {
            const response = await request(HOST)
                .get(`/api/auth/verify-email/123`)
                .send();
            expect(response.statusCode).toBe(500);
            expect(response._body.message).toBe('Code validation fail');
        });
        describe('post verify', () => {
            beforeEach(async () => {
                const user = await User.findOne({ email: userData.email });
                const response = await request(HOST)
                    .get(`/api/auth/verify-email/${user.emailVerificationCode}`)
                    .send();
                expect(response.statusCode).toBe(302);
            });
            test('Post /login should not be case sensitive', async () => {
                let response = await request(HOST)
                    .post(`/api/auth/login`)
                    .send(userData);
                expect(response.statusCode).toBe(200);

                response = await request(HOST)
                    .post(`/api/auth/login`)
                    .send(userData);
                expect(response.statusCode).toBe(200);
            });
            describe('recover password process', () => {
                beforeEach(async (context) => {
                    context.forgotData = { email: userData.email };
                });
                test('Post /forgot-password should revert Email is required', async () => {
                    const response = await request(HOST)
                        .post(`/api/auth/forgot-password`)
                        .send();
                    expect(response.statusCode).toBe(400);
                    expect(response._body.message).toBe('Email is required!');
                });

                test('Post /forgot-password should revert Email is not valid', async () => {
                    const response = await request(HOST)
                        .post(`/api/auth/forgot-password`)
                        .send({ email: 'a' });
                    expect(response.statusCode).toBe(400);
                    expect(response._body.message).toBe('Email is not valid!');
                });

                test('Post /forgot-password should revert User not exist', async () => {
                    const response = await request(HOST)
                        .post(`/api/auth/forgot-password`)
                        .send({ email: 'hola@gmail.com' });
                    expect(response.statusCode).toBe(404);
                    expect(response._body.message).toBe('User not exist!');
                });

                test('Post /forgot-password should send code', async ({
                    forgotData,
                }) => {
                    const response = await request(HOST)
                        .post(`/api/auth/forgot-password`)
                        .send({ email: forgotData?.email });
                    const user = await User.findOne({
                        email: forgotData?.email,
                    });
                    expect(response.statusCode).toBe(200);
                    expect(user.passwordResetToken).toBeTruthy;
                });
                describe('reset password', () => {
                    beforeEach(async (context) => {
                        context.newPassword = '26092002';

                        const response = await request(HOST)
                            .post(`/api/auth/forgot-password`)
                            .send({ email: context?.forgotData?.email });
                        const user = await User.findOne({
                            email: context?.forgotData?.email,
                        });
                        expect(response.statusCode).toBe(200);
                        expect(user.passwordResetToken).toBeTruthy;
                    });
                    // Thing in a way to get email resetToken
                    test.skip('Post /reset-password reset password', async ({
                        forgotData,
                        newPassword,
                    }) => {
                        const user = await User.findOne({
                            email: forgotData?.email,
                        });

                        let response = await request(HOST)
                            .post(
                                // WARN: it is not the correct code
                                `/api/auth/reset-password/${user.passwordResetToken}`,
                            )
                            .send({ password: newPassword });
                        expect(response.statusCode).toBe(200);
                        response = await request(HOST)
                            .post(`/api/auth/login`)
                            .send({
                                email: userData.email,
                                password: newPassword,
                            });
                        expect(response.statusCode).toBe(200);
                    });
                    test('Post /reset-password should revert Password must be greater than 6 characters', async ({
                        forgotData,
                    }) => {
                        const user = await User.findOne({
                            email: forgotData?.email,
                        });
                        const response = await request(HOST)
                            .post(
                                `/api/auth/reset-password/${user.passwordResetToken}`,
                            )
                            .send({ password: 'a' });

                        expect(response.statusCode).toBe(400);
                        expect(response._body.message).toBe(
                            'Password must be greater than 6 characters!',
                        );
                    });
                    test('Post /reset-password should revert Token is invalid', async ({
                        newPassword,
                    }) => {
                        const response = await request(HOST)
                            .post(`/api/auth/reset-password/a`)
                            .send({ password: newPassword });

                        expect(response.statusCode).toBe(400);
                        expect(response._body.message).toBe(
                            'Token is invalid or has expired',
                        );
                    });
                    test('Post /reset-password should revert Token is expired', async ({
                        forgotData,
                        newPassword,
                    }) => {
                        const user = await User.findOne({
                            email: forgotData?.email,
                        });
                        const response = await request(HOST)
                            .post(
                                `/api/auth/reset-password/${user.passwordResetToken}`,
                            )
                            .send({ password: newPassword });
                        vi.setSystemTime(Date.now() + 10 * 60 * 1000 + 1);
                        expect(response.statusCode).toBe(400);
                        expect(response._body.message).toBe(
                            'Token is invalid or has expired',
                        );
                    });
                });
            });

            describe('apiKey', () => {
                beforeEach(async (context) => {
                    const response = await request(HOST)
                        .post(`/api/auth/login`)
                        .send(userData);
                    expect(response.statusCode).toBe(200);
                    context.token = 'Bearer ' + response._body.Token;
                });
                test('create api key', async ({ token }) => {
                    const response = await request(HOST)
                        .post(`/api/auth/create-api-key`)
                        .send(userData)
                        .set({ Authorization: token });

                    expect(response.statusCode).toBe(200);
                    expect(response._body.apiKey).toBeTruthy;
                });
            });
        });
    });
});
