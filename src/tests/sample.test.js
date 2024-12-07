const axios = require('axios');

describe('POST Request For Creating An Account', () => {
    let expect;
    let server;

    before(async () => {
        const chai = await import('chai');
        expect = chai.expect;
        server = await import('../../server.ts'); // Adjust the path to point to your root server file
    });

    it('should register a new user', async () => {
        const response = await axios.post('http://localhost:3000/api/auth/register', {
            email: 'test@example.com',
            password: 'password123',
            fullName: 'Test User'
        });

        expect(response.status).to.equal(201);
        expect(response.data).to.have.property('message', 'User registered successfully');
    });

    it('should return true', () => {
        const result = true;
        expect(result).to.be.true;
    });

    it('should return false', () => {
        const result = false;
        expect(result).to.be.false;
    });
});
