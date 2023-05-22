"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const vitest_1 = require("vitest");
const request = require("supertest");
const db_1 = require("../db");
const userModel_1 = require("src/models/userModel");
const vitest_2 = require("vitest");
const HOST = process.env.HOST_TEST;
(0, vitest_1.describe)('testing-server-routes', () => {
    const userData = {
        email: 'oscaremiliolugo.dev@gmail.com',
        password: '26092002Aa*',
    };
    (0, vitest_1.beforeEach)((context) => __awaiter(void 0, void 0, void 0, function* () {
        if (process.env.NODE_ENV === 'test') {
            context.db = yield (0, db_1.default)();
            yield context.db.connection.db.dropDatabase();
            console.log('db deleted');
        }
    }));
    (0, vitest_1.test)('POST /login - fail user dont exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(HOST)
            .post(`/api/auth/login`)
            .send(userData);
        (0, vitest_1.expect)(response.statusCode).toBe(404);
        (0, vitest_1.expect)(response._body.message).toBe('User with this email does not exist!');
    }));
    (0, vitest_1.test)('POST /signup - create user', () => __awaiter(void 0, void 0, void 0, function* () {
        const userSignup = Object.assign(Object.assign({}, userData), { phone: undefined });
        const response = yield request(HOST)
            .post(`/api/auth/signup`)
            .send(userSignup);
        (0, vitest_1.expect)(response._body.status).toBe('success');
        (0, vitest_1.expect)(response._body.user[0].email).toBe(userSignup.email);
        (0, vitest_1.expect)(response._body.user.phone).toBe(userSignup.phone);
    }));
    (0, vitest_1.describe)('Complete auth process', () => {
        (0, vitest_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
            const userSignup = Object.assign(Object.assign({}, userData), { phone: undefined });
            const response = yield request(HOST)
                .post(`/api/auth/signup`)
                .send(userSignup);
            (0, vitest_1.expect)(response._body.status).toBe('success');
            (0, vitest_1.expect)(response._body.user[0].email).toBe(userSignup.email);
            (0, vitest_1.expect)(response._body.user.phone).toBe(userSignup.phone);
        }));
        (0, vitest_1.test)('revert: Email already taken Post/ signup create user', () => __awaiter(void 0, void 0, void 0, function* () {
            const userSignup = Object.assign(Object.assign({}, userData), { phone: undefined });
            const response = yield request(HOST)
                .post(`/api/auth/signup`)
                .send(userSignup);
            (0, vitest_1.expect)(response._body.status).toBe('fail');
            (0, vitest_1.expect)(response._body.message).toBe('Email already taken');
            (0, vitest_1.expect)(response.statusCode).toBe(400);
        }));
        (0, vitest_1.test)('Post /login should revet not verified', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request(HOST)
                .post(`/api/auth/login`)
                .send(userData);
            (0, vitest_1.expect)(response.statusCode).toBe(400);
            (0, vitest_1.expect)(response._body.message).toBe('Your email has not been verified yet!');
        }));
        (0, vitest_1.test)('Post /verify should verify', () => __awaiter(void 0, void 0, void 0, function* () {
            let user = yield userModel_1.User.findOne({ email: userData.email });
            const response = yield request(HOST)
                .get(`/api/auth/verify-email/${user.emailVerificationCode}`)
                .send();
            (0, vitest_1.expect)(response.statusCode).toBe(302);
            user = yield userModel_1.User.findOne({ email: userData.email });
            (0, vitest_1.expect)(user.emailVerified);
        }));
        (0, vitest_1.test)('Post /verify should revert Code validation fail', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request(HOST)
                .get(`/api/auth/verify-email/123`)
                .send();
            (0, vitest_1.expect)(response.statusCode).toBe(500);
            (0, vitest_1.expect)(response._body.message).toBe('Code validation fail');
        }));
        (0, vitest_1.describe)('post verify', () => {
            (0, vitest_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
                const user = yield userModel_1.User.findOne({ email: userData.email });
                const response = yield request(HOST)
                    .get(`/api/auth/verify-email/${user.emailVerificationCode}`)
                    .send();
                (0, vitest_1.expect)(response.statusCode).toBe(302);
            }));
            (0, vitest_1.test)('Post /login should not be case sensitive', () => __awaiter(void 0, void 0, void 0, function* () {
                let response = yield request(HOST)
                    .post(`/api/auth/login`)
                    .send(userData);
                (0, vitest_1.expect)(response.statusCode).toBe(200);
                response = yield request(HOST)
                    .post(`/api/auth/login`)
                    .send(userData);
                (0, vitest_1.expect)(response.statusCode).toBe(200);
            }));
            (0, vitest_1.describe)('recover password process', () => {
                (0, vitest_1.beforeEach)((context) => __awaiter(void 0, void 0, void 0, function* () {
                    context.forgotData = { email: userData.email };
                }));
                (0, vitest_1.test)('Post /forgot-password should revert Email is required', () => __awaiter(void 0, void 0, void 0, function* () {
                    const response = yield request(HOST)
                        .post(`/api/auth/forgot-password`)
                        .send();
                    (0, vitest_1.expect)(response.statusCode).toBe(400);
                    (0, vitest_1.expect)(response._body.message).toBe('Email is required!');
                }));
                (0, vitest_1.test)('Post /forgot-password should revert Email is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
                    const response = yield request(HOST)
                        .post(`/api/auth/forgot-password`)
                        .send({ email: 'a' });
                    (0, vitest_1.expect)(response.statusCode).toBe(400);
                    (0, vitest_1.expect)(response._body.message).toBe('Email is not valid!');
                }));
                (0, vitest_1.test)('Post /forgot-password should revert User not exist', () => __awaiter(void 0, void 0, void 0, function* () {
                    const response = yield request(HOST)
                        .post(`/api/auth/forgot-password`)
                        .send({ email: 'hola@gmail.com' });
                    (0, vitest_1.expect)(response.statusCode).toBe(404);
                    (0, vitest_1.expect)(response._body.message).toBe('User not exist!');
                }));
                (0, vitest_1.test)('Post /forgot-password should send code', ({ forgotData, }) => __awaiter(void 0, void 0, void 0, function* () {
                    const response = yield request(HOST)
                        .post(`/api/auth/forgot-password`)
                        .send({ email: forgotData.email });
                    const user = yield userModel_1.User.findOne({
                        email: forgotData.email,
                    });
                    (0, vitest_1.expect)(response.statusCode).toBe(200);
                    (0, vitest_1.expect)(user.passwordResetToken).toBeTruthy;
                }));
                (0, vitest_1.describe)('reset password', () => {
                    (0, vitest_1.beforeEach)((context) => __awaiter(void 0, void 0, void 0, function* () {
                        context.newPassword = '26092002';
                        const response = yield request(HOST)
                            .post(`/api/auth/forgot-password`)
                            .send({ email: context.forgotData.email });
                        const user = yield userModel_1.User.findOne({
                            email: context.forgotData.email,
                        });
                        (0, vitest_1.expect)(response.statusCode).toBe(200);
                        (0, vitest_1.expect)(user.passwordResetToken).toBeTruthy;
                    }));
                    // Thing in a way to get email resetToken
                    vitest_1.test.skip('Post /reset-password reset password', ({ forgotData, newPassword, }) => __awaiter(void 0, void 0, void 0, function* () {
                        const user = yield userModel_1.User.findOne({
                            email: forgotData.email,
                        });
                        let response = yield request(HOST)
                            .post(
                        // WARN: it is not the correct code
                        `/api/auth/reset-password/${user.passwordResetToken}`)
                            .send({ password: newPassword });
                        (0, vitest_1.expect)(response.statusCode).toBe(200);
                        response = yield request(HOST)
                            .post(`/api/auth/login`)
                            .send({
                            email: userData.email,
                            password: newPassword,
                        });
                        (0, vitest_1.expect)(response.statusCode).toBe(200);
                    }));
                    (0, vitest_1.test)('Post /reset-password should revert Password must be greater than 6 characters', ({ forgotData, }) => __awaiter(void 0, void 0, void 0, function* () {
                        const user = yield userModel_1.User.findOne({
                            email: forgotData.email,
                        });
                        const response = yield request(HOST)
                            .post(`/api/auth/reset-password/${user.passwordResetToken}`)
                            .send({ password: 'a' });
                        (0, vitest_1.expect)(response.statusCode).toBe(400);
                        (0, vitest_1.expect)(response._body.message).toBe('Password must be greater than 6 characters!');
                    }));
                    (0, vitest_1.test)('Post /reset-password should revert Token is invalid', ({ newPassword, }) => __awaiter(void 0, void 0, void 0, function* () {
                        const response = yield request(HOST)
                            .post(`/api/auth/reset-password/a`)
                            .send({ password: newPassword });
                        (0, vitest_1.expect)(response.statusCode).toBe(400);
                        (0, vitest_1.expect)(response._body.message).toBe('Token is invalid or has expired');
                    }));
                    (0, vitest_1.test)('Post /reset-password should revert Token is expired', ({ forgotData, newPassword, }) => __awaiter(void 0, void 0, void 0, function* () {
                        const user = yield userModel_1.User.findOne({
                            email: forgotData.email,
                        });
                        const response = yield request(HOST)
                            .post(`/api/auth/reset-password/${user.passwordResetToken}`)
                            .send({ password: newPassword });
                        vitest_2.vi.setSystemTime(Date.now() + 10 * 60 * 1000 + 1);
                        (0, vitest_1.expect)(response.statusCode).toBe(400);
                        (0, vitest_1.expect)(response._body.message).toBe('Token is invalid or has expired');
                    }));
                });
            });
        });
    });
});
//# sourceMappingURL=user.test.js.map