// import supertest = require('supertest');
import app = require('../app');

describe('testing-server-routes', () => {
    it('GET /signup - success', async () => {
        const { body } = await request(app).get('/login'); //uses the request function that calls on express app instance
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
