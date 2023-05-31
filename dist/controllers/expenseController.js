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
exports.createExpensesByJson = exports.updateExpense = exports.deleteExpenses = exports.deleteExpense = exports.getExpense = exports.getExpenses = exports.createExpense = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const AppError_1 = require("../utils/AppError");
const expenseModel_1 = require("../models/expenseModel");
exports.createExpense = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, category, description } = req.body;
    const { _id } = req.user;
    if (!amount || !category || !description)
        return next(new AppError_1.AppError('Missing Data!', 400));
    const expense = yield expenseModel_1.Expense.create({
        amount,
        category,
        description,
        user: _id,
    });
    res.json({
        status: 'success',
        success: true,
        expense,
    });
}));
exports.getExpenses = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { page, limit } = req.query;
    const { _id } = req.user;
    const expends = yield expenseModel_1.Expense.find({ user: _id }, { sort: { createdAt: -1 } })
        .skip(Number(page) * Number(limit))
        .limit((_a = Number(limit)) !== null && _a !== void 0 ? _a : 20);
    res.json({
        status: 'success',
        success: true,
        expends,
    });
}));
exports.getExpense = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { expenseId } = req.params;
    const expend = yield expenseModel_1.Expense.findById(expenseId);
    res.json({
        success: true,
        status: 'success',
        expend,
    });
}));
exports.deleteExpense = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { expenseId } = req.params;
    const deletedExpend = yield expenseModel_1.Expense.findByIdAndDelete(expenseId);
    res.json({
        status: 'success',
        success: true,
        deletedExpend,
    });
}));
exports.deleteExpenses = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    const deletedExpenses = yield expenseModel_1.Expense.deleteMany({
        user: _id,
    });
    res.json({
        status: 'success',
        success: true,
        deletedExpenses,
    });
}));
exports.updateExpense = (0, asyncHandler_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { expenseId } = req.params;
    const { description, amount, category } = req.body;
    const expense = yield expenseModel_1.Expense.findByIdAndUpdate(expenseId, {
        description,
        category,
        amount,
    }, { new: true });
    res.json({
        status: 'success',
        success: true,
        expense,
    });
}));
exports.createExpensesByJson = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body.expenses;
    if (!data || !data.length)
        return next(new AppError_1.AppError('Data not provided', 400));
    const orderIdsRegistered = [];
    for (let i = 0; i < data.length; i++) {
        const expense = yield expenseModel_1.Expense.findOne({
            'binance.binanceId': data[i].orderId,
        });
        if (expense)
            orderIdsRegistered.push(data[i].orderId);
    }
    const formatedData = data
        .map((order) => {
        var _a;
        if (!orderIdsRegistered.includes(order.orderId)) {
            orderIdsRegistered.push(order.orderId);
            return {
                amount: Number(order.amount),
                binance: {
                    binanceId: order.orderId,
                    unitPrice: order.unitPrice,
                    fiat: order.fiat,
                    total: order.total,
                    asset: order.asset,
                    seller: order.seller,
                    date: new Date(order.date),
                    orderType: (_a = order.orderType) !== null && _a !== void 0 ? _a : 'P2P',
                },
                user: req.user._id,
                // TODO: add category unknown
                description: order.note &&
                    order.note !== '' &&
                    order.note !== ' '
                    ? order.note
                    : `this is a binance order created on ${new Date(order.date)} and not edited. Please add what do you buy here: `,
            };
        }
    })
        .filter((order) => Boolean(order));
    if (formatedData.length === 0)
        return next(new AppError_1.AppError('Not correct data send', 500));
    const ids = yield expenseModel_1.Expense.create(formatedData);
    res.json({ success: true, status: 'success', expenses: ids });
}));
//# sourceMappingURL=expenseController.js.map