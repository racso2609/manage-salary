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
exports.signup = exports.login = exports.HOST = void 0;
const request = require("supertest");
require('dotenv').config();
exports.HOST = process.env.HOST_TEST;
const login = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield request(exports.HOST).post(`/api/auth/login`).send(userData);
    return response;
});
exports.login = login;
const signup = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const userSignup = Object.assign(Object.assign({}, userData), { phone: undefined });
    const response = yield request(exports.HOST)
        .post(`/api/auth/signup`)
        .send(userSignup);
    return response;
});
exports.signup = signup;
//# sourceMappingURL=index.js.map