import passport = require('passport');
import { Strategy, ExtractJwt } from 'passport-jwt';
import { NextFunction, Request, Response } from 'express';
import { AppError } from '@/utils/AppError';
import { userInterface, User } from '@/models/userModel';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import env from './env';

type IDone = (error: null | Error, user?: userInterface) => void;

passport.use(
    new Strategy(
        {
            secretOrKey: env.SECRET_KEY,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(
                env.SECRET_KEY,
            ),
        },
        async (token: any, done: IDone) => {
            try {
                return done(null, token.user);
            } catch (error) {
                return done(error);
            }
        },
    ),
);

export const restrictTo =
    (...roles: [string]) =>
    (req: Request, _res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role))
            return next(
                new AppError(
                    'You do not have access to perform this action',
                    403,
                ),
            );

        next();
    };

passport.use(
    new HeaderAPIKeyStrategy(
        { header: 'Authorization', prefix: 'ApiKey ' },
        false,
        async function (apikey, done) {
            console.log('hello', apikey);
            try {
                const user = await User.findOne({ apiKey: apikey });
                if (!user) {
                    return done(null, false);
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        },
    ),
);

export const protect = passport.authenticate('jwt', { session: false });
export const apiKeyProtected = passport.authenticate('headerapikey', {
    session: false,
});
