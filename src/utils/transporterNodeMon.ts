import nodemailer = require('nodemailer');
import env from '@/env';

export const transporter = () =>
    nodemailer.createTransport({
        service: env.EMAIL_SERVICE,
        auth: {
            user: env.EMAIL_FROM,
            pass: env.EMAIL_PWD,
        },
    });
