"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
const transporterNodeMon_1 = require("./transporterNodeMon");
class Email {
    constructor(to, subject, text, html) {
        this.message = {
            to,
            from: process.env.EMAIL_FROM,
            subject,
            text,
        };
        if (html)
            this.message.html = html;
    }
    send() {
        return __awaiter(this, void 0, void 0, function* () {
            transporterNodeMon_1.transporter.sendMail(this.message, (error) => {
                if (error) {
                    throw error;
                }
            });
        });
    }
}
exports.Email = Email;
//# sourceMappingURL=Email.js.map