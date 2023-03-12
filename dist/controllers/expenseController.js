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
exports.updateExpense = exports.deleteExpense = exports.getExpense = exports.getExpenses = exports.createExpense = void 0;
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
    const { _id } = req.user;
    const expends = yield expenseModel_1.Expense.find({ user: _id });
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
//# sourceMappingURL=expenseController.js.map