"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.app = void 0;
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const morgan = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv");
//import xss from "xss";
// import ratelimit = require('express-rate-limit');
const globalError_1 = require("./controllers/globalError");
const AppError_1 = require("./utils/AppError");
dotenv.config();
exports.app = express();
// const limit = ratelimit({
// max: 1000,
// windowMs: 60 * 60 * 1000,
// message: 'Too Many request, you are blocked for 1 hour',
// });
exports.app.use(express.urlencoded({ extended: false, limit: '10mb' }));
// app.use(express.json({ limit: '10mb' }));
exports.app.use(express.json());
// app.use('*', limit);
exports.app.use(helmet());
//app.use(xss());
exports.app.use(cors());
exports.app.use(passport.initialize());
exports.app.use(morgan(process.env.LOGGER));
exports.app.use(globalError_1.globalErrorController);
//Routes
const user_1 = require("./routes/user");
const category_1 = require("./routes/category");
const entry_1 = require("./routes/entry");
const expense_1 = require("./routes/expense");
const data_1 = require("./routes/data");
const automaticEntries_1 = require("./routes/automaticEntries");
const db_1 = require("./db");
exports.app.use('/api/auth', user_1.default);
exports.app.use('/api/categories', category_1.default);
exports.app.use('/api/entries', entry_1.default);
exports.app.use('/api/expenses', expense_1.default);
exports.app.use('/api/data', data_1.default);
exports.app.use('/api/automatic-entries', automaticEntries_1.default);
exports.app.all('*', (_req, _res, next) => {
    return next(new AppError_1.AppError('This route is not yet defined!', 404));
});
exports.app.use(globalError_1.globalErrorController);
const PORT = process.env.PORT || 3001;
exports.app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
exports.db = (0, db_1.default)()
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
//# sourceMappingURL=app.js.map