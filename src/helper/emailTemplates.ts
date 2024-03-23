import User from '@/models/userModel';

export const getVerificationEmailTemplate = (
    user: User,
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
