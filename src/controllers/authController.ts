import { AppError } from '../utils/AppError';
import { NextFunction, Request, Response } from 'express';
import jwt = require('jsonwebtoken');
import { User, userInterface } from '../models/userModel';
import { Email } from '../utils/Email';
import { getVerificationEmailTemplate } from '../helper/emailTemplates';
import crypto = require('crypto');
import { asyncHandler } from '../utils/asyncHandler';
import { Payload } from '../interfaces/interfaces';

const isValidEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

declare global {
    namespace Express {
        interface User {
            _id: string;
            email: string;
            role: string;
            phone: string;
            name: string;
        }
    }
}

const signToken = (payload: Payload) =>
    jwt.sign({ user: payload }, process.env.SECRET_KEY, {
        expiresIn: 7200,
    });

const sendVerificationEmail = async (
    user: userInterface,
    verificationUrl: string
) => {
    try {
        await new Email(
            user.email,
            'Verify your email',
            'Please verify your email by clicking on the button above',
            getVerificationEmailTemplate(user, verificationUrl)
        ).send();
    } catch (error) {
        // TODO: add db task to auto re-run
        // Note: should make a way to notificate to the admin
        console.error(error.message);
    }
};

export const signup = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { firstName, lastName, password, phone }: userInterface =
            req.body;

        let email = req.body.email;
        email = email.toLowerCase();

        const existingUser = await User.findOne({ email });
        if (existingUser) return next(new AppError('Email already taken', 400));

        const emailVerificationCode = crypto.randomBytes(32).toString('hex');
        const createdUser = await User.create({
            firstName,
            lastName,
            email,
            password,
            phone,
            photo: process.env.DEFAULT_USER_PHOTO,
            emailVerificationCode,
            emailVerified: false,
        });
        const user = await User.find(createdUser._id).select(
            'firstName lastName role phone email photo'
        );
        const verificationUrl = `${req.protocol}://${req.headers.host}/api/auth/verify-email/${emailVerificationCode}`;
        await sendVerificationEmail(createdUser, verificationUrl);

        res.status(201).json({
            status: 'success',
            success: true,
            user,
        });
    }
);
export const login = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { password }: { email: string; password: string } = req.body;
        let email = req.body.email;
        email = email.toLowerCase();

        const user = await User.findOne({ email });

        if (!user)
            return next(
                new AppError('User with this email does not exist!', 404)
            );

        if (!user.emailVerified)
            return next(
                new AppError('Your email has not been verified yet!', 400)
            );
        const isCorrectPassword = user.isValidPassword(password);
        if (!isCorrectPassword)
            return next(new AppError('Wrong password!', 404));

        const payload: Payload = {
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
    }
);

export const verifyEmail = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { emailVerificationCode } = req.params;

        const user = await User.findOneAndUpdate(
            { emailVerificationCode },
            { emailVerified: true },
            { new: true }
        );

        if (!user) return next(new AppError('Code validation fail', 500));

        const redirectionUrl = process.env.HOST;
        res.redirect(redirectionUrl);
    }
);

export const forgotPassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email }: { email: string } = req.body;

        if (!email) return next(new AppError('Email is required!', 400));
        if (!isValidEmail(email))
            return next(new AppError('Email is not valid!', 400));

        const user = await User.findOne({ email });
        if (!user) return next(new AppError('User not exist!', 404));

        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        const message = `Forgot password? \n Copy your code: ${resetToken}`;
        try {
            await new Email(user.email, 'Password Reset', message).send();
            res.status(200).json({
                status: 'success',
                success: true,
                message: 'Token sent to email!',
            });
        } catch (error) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;

            await user.save({ validateBeforeSave: false });
            return next(
                new AppError(
                    'There was an error sending email. Try again later!',
                    500
                )
            );
        }
    }
);

export const resetPassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { password } = req.body;

        if (!password || password.length < 6)
            return next(
                new AppError('Password must be greater than 6 characters!', 400)
            );

        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.resetToken)
            .digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!user)
            return next(new AppError('Token is invalid or has expired', 400));

        user.password = password;
        user.passwordResetExpires = undefined;
        user.passwordResetToken = undefined;

        await user.save();

        const payload: Payload = {
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
    }
);

export const getProfile = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
        const user = await User.findById(req.user._id).select(
            'firstName lastName role phone email'
        );
        res.status(200).json({
            status: 'success',
            success: true,
            user,
        });
    }
);
export const updateProfile = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
        const { firstName, lastName, phone, email } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                firstName,
                lastName,
                email,
                phone,
            },
            { new: true }
        );

        res.status(200).json({
            status: 'success',
            data: updatedUser,
        });
    }
);

export const getLoggedInUser = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
        const { _id } = req.user;
        const user = await User.findById(_id);

        res.status(200).json({
            role: user.role,
            Email: user.email,
            Phone: user.phone,
            Firstname: user.firstName,
            Lastname: user.lastName,
            success: true,
        });
    }
);
