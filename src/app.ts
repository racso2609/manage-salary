import env from '@/env';
import express = require('express');
import { Request, Response, NextFunction } from 'express';
import cors = require('cors');
import passport = require('passport');
import morgan = require('morgan');
import helmet = require('helmet');
import userRouter from '@/routes/user';
import categoryRouter from '@/routes/category';
import entryRouter from '@/routes/entry';
import expenseRouter from '@/routes/expense';
import dataRouter from '@/routes/data';
import databaseConnection from './db';
import { globalErrorController } from '@/controllers/globalError';
import { AppError } from '@/utils/AppError';

export const app = express();
// const limit = ratelimit({
// max: 1000,
// windowMs: 60 * 60 * 1000,
// message: 'Too Many request, you are blocked for 1 hour',
// });

app.use(express.urlencoded({ extended: false, limit: '10mb' }));
// app.use(express.json({ limit: '10mb' }));
app.use(express.json());
// app.use('*', limit);

app.use(helmet());
//app.use(xss());

app.use(cors());
app.use(passport.initialize());
app.use(morgan(env.LOGGER));
app.use(globalErrorController);

//Routes

app.use('/api/auth', userRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/entries', entryRouter);
app.use('/api/expenses', expenseRouter);
app.use('/api/data', dataRouter);

app.all('*', (_req: Request, _res: Response, next: NextFunction) => {
    return next(new AppError('This route is not yet defined!', 404));
});

app.use(globalErrorController);

const PORT = env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
export const db = databaseConnection()
    .then()
    .catch((e) => {
        console.log(e);
        process.exit(1);
    });

['unhandledRejection', 'uncaughtException'].forEach((processEvent) => {
    process.on(processEvent, (error) => {
        console.log(error);
        process.exit(1);
    });
});
