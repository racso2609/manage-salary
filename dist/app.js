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
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const morgan = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv");
//import xss from "xss";
// import ratelimit = require('express-rate-limit');
const mongoose = require("mongoose");
const globalError_1 = require("./controllers/globalError");
const AppError_1 = require("./utils/AppError");
dotenv.config();
const app = express();
// const limit = ratelimit({
// max: 1000,
// windowMs: 60 * 60 * 1000,
// message: 'Too Many request, you are blocked for 1 hour',
// });
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.json());
// app.use('*', limit);
app.use(helmet());
//app.use(xss());
app.use(cors());
app.use(passport.initialize());
app.use(morgan(process.env.LOGGER));
app.use(globalError_1.globalErrorController);
//Routes
const user_1 = require("./routes/user");
const category_1 = require("./routes/category");
const entry_1 = require("./routes/entry");
const expense_1 = require("./routes/expense");
const data_1 = require("./routes/data");
const automaticEntries_1 = require("./routes/automaticEntries");
app.use('/api/auth', user_1.default);
app.use('/api/categories', category_1.default);
app.use('/api/entries', entry_1.default);
app.use('/api/expenses', expense_1.default);
app.use('/api/data', data_1.default);
app.use('/api/automatic-entries', automaticEntries_1.default);
app.all('*', (_req, _res, next) => {
    return next(new AppError_1.AppError('This route is not yet defined!', 404));
});
app.use(globalError_1.globalErrorController);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { NODE_ENV, MONGO_URI_TEST, MONGO_URI } = process.env;
        const connectionString = NODE_ENV === 'test' ? MONGO_URI_TEST : MONGO_URI;
        yield mongoose.connect(connectionString, {});
        console.log('Database Connected');
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
    }
    catch (err) {
        console.log('Error', err);
        process.exit(1);
    }
}))();
['unhandledRejection', 'uncaughtException'].forEach((processEvent) => {
    process.on(processEvent, (error) => {
        console.log(error);
        process.exit(1);
    });
});
module.exports = app;
//# sourceMappingURL=app.js.map