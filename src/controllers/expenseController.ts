import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { Response, Request, NextFunction } from 'express';
import { expenseInterface, Expense } from '../models/expenseModel';

export const createExpense = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { amount, category, description }: expenseInterface = req.body;
        const { _id } = req.user;
        if (!amount || !category || !description)
            return next(new AppError('Missing Data!', 400));
        const expense = await Expense.create({
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
    }
);

export const getExpenses = asyncHandler(async (req: Request, res: Response) => {
    const { _id } = req.user;
    const expends = await Expense.find({ user: _id });
    res.json({
        status: 'success',
        success: true,
        expends,
    });
});

export const getExpense = asyncHandler(async (req: Request, res: Response) => {
    const { expendId } = req.params;
    const expend = await Expense.findById(expendId);
    res.json({
        success: true,
        status: 'success',
        expend,
    });
});

export const deleteExpense = asyncHandler(
    async (req: Request, res: Response) => {
        const { expendId } = req.params;
        const deletedExpend = await Expense.findByIdAndDelete(expendId);
        res.json({
            status: 'success',
            success: true,
            deletedExpend,
        });
    }
);
