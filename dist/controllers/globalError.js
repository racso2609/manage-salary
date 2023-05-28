"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorController = void 0;
const sendErrorDevelopment = (error, res) => {
    res.status(error.statusCode || 500).json({
        status: error.status || 'error',
        message: error.message,
        stack: error.stack,
        error,
    });
};
const sendErrorProduction = (error, res) => {
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        });
    }
    else {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!',
        });
    }
};
const globalErrorController = (error, _req, res, _next) => {
    if (process.env.NODE_ENV === 'test')
        sendErrorDevelopment(error, res);
    if (process.env.NODE_ENV === 'development')
        sendErrorDevelopment(error, res);
    if (process.env.NODE_ENV === 'production')
        sendErrorProduction(error, res);
};
exports.globalErrorController = globalErrorController;
//# sourceMappingURL=globalError.js.map