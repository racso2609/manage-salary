'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.transporter = void 0
const nodemailer = require('nodemailer')
require('dotenv').config()
const transporter = () => nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PWD
  }
})
exports.transporter = transporter
// # sourceMappingURL=transporterNodeMon.js.map
