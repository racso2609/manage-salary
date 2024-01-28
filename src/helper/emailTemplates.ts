import { userInterface } from '@/models/userModel';

export const getVerificationEmailTemplate = (
    user: userInterface,
    verificationUrl: string,
) => {
    return `
    <div>
    <span>Thanks for signing up</span>, ${user.firstName} ${user.lastName}
    <div>
<a href="${verificationUrl}">Click here to verify email </a>
    </div>
    </div>
    `;
};
