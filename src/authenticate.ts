import passport = require('passport');
import { Strategy, ExtractJwt } from 'passport-jwt';
import { NextFunction, Request, Response } from 'express';
import { AppError } from './utils/AppError';
import { userInterface } from './models/userModel';

type IDone = (error: null | Error, user?: userInterface) => void;

passport.use(
    new Strategy(
        {
            secretOrKey: process.env.SECRET_KEY,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(
                process.env.SECRET_KEY
            ),
        },
        async (token: any, done: IDone) => {
            try {
                return done(null, token.user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

export const restrictTo =
    (...roles: [string]) =>
    (req: Request, _res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role))
            return next(
                new AppError(
                    'You do not have access to perform this action',
                    403
                )
            );

        next();
    };

export const protect = passport.authenticate('jwt', { session: false });
