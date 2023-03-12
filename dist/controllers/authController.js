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
exports.getLoggedInUser = exports.updateProfile = exports.getProfile = exports.resetPassword = exports.forgotPassword = exports.verifyEmail = exports.login = exports.signup = void 0;
const AppError_1 = require("../utils/AppError");
const jwt = require("jsonwebtoken");
const userModel_1 = require("../models/userModel");
const Email_1 = require("../utils/Email");
const emailTemplates_1 = require("../helper/emailTemplates");
const crypto = require("crypto");
const asyncHandler_1 = require("../utils/asyncHandler");
const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
const signToken = (payload) => jwt.sign({ user: payload }, process.env.SECRET_KEY, {
    expiresIn: 7200,
});
const sendVerificationEmail = (user, verificationUrl) => {
    new Email_1.Email(user.email, 'Verify your email', 'Please verify your email by clicking on the button above', (0, emailTemplates_1.getVerificationEmailTemplate)(user, verificationUrl)).send();
};
exports.signup = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password, phone } = req.body;
    const existingUser = yield userModel_1.User.findOne({ email });
    if (existingUser)
        return next(new AppError_1.AppError('Email already taken', 400));
    const emailVerificationCode = crypto.randomBytes(32).toString('hex');
    const createdUser = yield userModel_1.User.create({
        firstName,
        lastName,
        email,
        password,
        phone,
        photo: process.env.DEFAULT_USER_PHOTO,
        emailVerificationCode,
        emailVerified: false,
    });
    const user = yield userModel_1.User.find(createdUser._id).select('firstName lastName role phone email photo');
    const verificationUrl = `${req.protocol}://${req.headers.host}/api/auth/verify-email/${emailVerificationCode}`;
    sendVerificationEmail(createdUser, verificationUrl);
    res.status(201).json({
        status: 'success',
        success: true,
        user,
    });
}));
exports.login = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield userModel_1.User.findOne({ email });
    if (!user)
        return next(new AppError_1.AppError('User with this email does not exist!', 404));
    if (!user.emailVerified)
        return next(new AppError_1.AppError('Your email has not been verified yet!', 400));
    const isCorrectPassword = user.isValidPassword(password);
    if (!isCorrectPassword)
        return next(new AppError_1.AppError('Wrong password!', 404));
    const payload = {
        _id: user._id,
        email: user.email,
        role: user.role,
        phone: user.phone,
        name: `${user.firstName} ${user.lastName}`,
    };
    const token = signToken(payload);
    res.json({
        status: 'success',
        success: true,
        Token: token,
        role: user.role,
        email: user.email,
        phone: user.phone,
        firstname: user.firstName,
        lastname: user.lastName,
    });
}));
exports.verifyEmail = (0, asyncHandler_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { emailVerificationCode } = req.params;
    yield userModel_1.User.findOneAndUpdate({ emailVerificationCode }, { emailVerified: true }, { new: true });
    const redirectionUrl = process.env.HOST;
    res.redirect(redirectionUrl);
}));
exports.forgotPassword = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email)
        return next(new AppError_1.AppError('Email is required!', 400));
    if (!isValidEmail(email))
        return next(new AppError_1.AppError('Email is not valid!', 400));
    let user = yield userModel_1.User.findOne({ email });
    if (!user)
        return next(new AppError_1.AppError('User not exist!', 404));
    const resetToken = user.createPasswordResetToken();
    yield user.save({ validateBeforeSave: false });
    const message = `Forgot password? \n Copy your code: ${resetToken}`;
    try {
        yield new Email_1.Email(user.email, 'Password Reset', message).send();
        res.status(200).json({
            status: 'success',
            success: true,
            message: 'Token sent to email!',
        });
    }
    catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        yield user.save({ validateBeforeSave: false });
        return next(new AppError_1.AppError('There was an error sending email. Try again later!', 500));
    }
}));
exports.resetPassword = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    if (!password || password.length < 6)
        return next(new AppError_1.AppError('Password must be greater than 6 characters!', 400));
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex');
    const user = yield userModel_1.User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user)
        return next(new AppError_1.AppError('Token is invalid or has expired', 400));
    user.password = password;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    yield user.save();
    const payload = {
        _id: user._id,
        email: user.email,
        role: user.role,
        phone: user.phone,
        name: user.firstName + ' ' + user.lastName,
    };
    const token = signToken(payload);
    res.status(200).json({
        status: 'success',
        token,
        data: payload,
    });
}));
exports.getProfile = (0, asyncHandler_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.User.findById(req.user._id).select('firstName lastName role phone email');
    res.status(200).json({
        status: 'success',
        success: true,
        user,
    });
}));
exports.updateProfile = (0, asyncHandler_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, phone, email } = req.body;
    const updatedUser = yield userModel_1.User.findByIdAndUpdate(req.user._id, {
        firstName,
        lastName,
        email,
        phone,
    }, { new: true });
    res.status(200).json({
        status: 'success',
        data: updatedUser,
    });
}));
exports.getLoggedInUser = (0, asyncHandler_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    const user = yield userModel_1.User.findById(_id);
    res.status(200).json({
        role: user.role,
        Email: user.email,
        Phone: user.phone,
        Firstname: user.firstName,
        Lastname: user.lastName,
        success: true,
    });
}));
//# sourceMappingURL=authController.js.map