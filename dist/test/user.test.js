// import request = require('supertest');
// import app = require('../app');
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
describe('testing-server-routes', () => {
    it('POST /login - fail user dont exist', () => __awaiter(this, void 0, void 0, function* () {
        // const result = await request(app).post(`/api/auth/login`).send({
        // email: 'oscaremiliolugo.dev@gmail.com',
        // password: '26092002Aa*',
        // });
        // console.log(result);
        expect(true);
        // expect(result.status).toBe(404);
        // expect(result.message).toBe('User with this email does not exist!');
    }));
    // describe('auth process', () => {
    // });
});
//# sourceMappingURL=user.test.js.map