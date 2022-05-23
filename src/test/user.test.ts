import * as request from 'supertest';
import app = require('../app');

describe('testing-server-routes', () => {
    describe('auth process', () => {
        it('POST /login - dail user dont exist', async () => {
            await expect(
                request(app).post('/login').send({
                    email: 'oscaremiliolugo.dev@gmail.com',
                    password: '26092002Aa*',
                })
            ).toThrow;

            // expect(body).toEqual([
            // {
            // state: 'NJ',
            // capital: 'Trenton',
            // governor: 'Phil Murphy',
            // },
            // {
            // state: 'CT',
            // capital: 'Hartford',
            // governor: 'Ned Lamont',
            // },
            // {
            // state: 'NY',
            // capital: 'Albany',
            // governor: 'Andrew Cuomo',
            // },
            // ]);
        });
    });
});
