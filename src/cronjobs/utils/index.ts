import crypto = require('crypto');

export const generateSignature = (query: string, secret: string) => {
    return crypto.createHmac('sha256', secret).update(query).digest('hex');
};
