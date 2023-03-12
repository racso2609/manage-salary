import axios from 'axios';
import { request } from 'https';
import { app } from '../app';

describe('testing-server-routes', () => {
    it('POST /login - fail user dont exist', async () => {
        try {
            await axios.post(`http://localhost:3001/api/auth/login`, {
                email: 'oscaremiliolugo.dev@gmail.com',
                password: '26092002Aa*',
            });
        } catch (error) {
            expect(error.response.status).toBe(404);
            expect(error.response.data.message).toBe(
                'User with this email does not exist!'
            );
        }
    });
    it('POST /login - success process ', async () => {
        const result = await axios.post(
            `http://localhost:3001/api/auth/login`,
            {
                email: 'oscaremiliolugo@gmail.com',
                password: '26092002Aa*',
            }
        );
        expect(result.data.status).toBe('success');
        expect(result.data.Token).toBeDefined();
    });
});
