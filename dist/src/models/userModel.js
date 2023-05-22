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
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const UserModel = new mongoose_1.Schema({
    email: {
        type: String,
        require: true,
        unique: true,
    },
    firstName: {
        type: String,
        require: true,
    },
    lastName: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    phone: {
        type: String,
    },
    role: {
        type: 'String',
        default: 'user',
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationCode: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
});
UserModel.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            return next();
        const hash = yield bcrypt.hash(this.password, 10);
        this.password = hash;
        next();
    });
});
UserModel.methods.isValidPassword = function (password) {
    return bcrypt.compare(password, this.password);
};
UserModel.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
const User = (0, mongoose_1.model)('User', UserModel);
exports.User = User;
//# sourceMappingURL=userModel.js.map