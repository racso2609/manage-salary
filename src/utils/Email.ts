import env from '@/env';
import { transporter } from '@/utils/transporterNodeMon';

interface EmailMessage {
    to: string;
    from: string;
    subject: string;
    text: string;
    html?: string;
}
export class Email {
    to: string;
    message: EmailMessage;
    constructor(to: string, subject: string, text: string, html?: string) {
        this.message = {
            to,
            from: env.EMAIL_FROM,
            subject,
            text,
        };
        if (html) this.message.html = html;
    }

    async send() {
        return await transporter().sendMail(this.message);
    }
}
