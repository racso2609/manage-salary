import request = require('supertest');
require('dotenv').config();

export const HOST = process.env.HOST_TEST;

export const login = async (userData: { email: string; password: string }) => {
    const response = await request(HOST).post(`/api/auth/login`).send(userData);

    return response;
};

export const signup = async (userData: { email: string; password: string }) => {
    const userSignup = { ...userData, phone: undefined };
    const response = await request(HOST)
        .post(`/api/auth/signup`)
        .send(userSignup);

    return response;
};
