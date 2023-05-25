'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.getVerificationEmailTemplate = void 0
const getVerificationEmailTemplate = (user, verificationUrl) => {
  return `
    <div>
    <span>Thanks for signing up</span>, ${user.firstName} ${user.lastName}
    <div>
<a href="${verificationUrl}">Click here to verify email </a>
    </div>
    </div>
    `
}
exports.getVerificationEmailTemplate = getVerificationEmailTemplate
// # sourceMappingURL=emailTemplates.js.map
