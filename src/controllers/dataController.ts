import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { Entry } from '../models/entryModel';
import { Expense } from '../models/expenseModel';
import { Types } from 'mongoose';
const ObjectId = Types.ObjectId;

export const getTotalAvaliable = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
        const { _id } = req.user;
        let totalExpenses = await Expense.aggregate([
            { $match: { user: ObjectId(_id) } },
            { $group: { _id: '', totalExpense: { $sum: '$amount' } } },
        ]);
        totalExpenses = totalExpenses[0].totalExpense;
        let totalEntries = await Entry.aggregate([
            { $match: { user: ObjectId(_id) } },
            { $group: { _id: '', totalEntry: { $sum: '$amount' } } },
        ]);
        totalEntries = totalEntries[0].totalEntry;
        
        res.json({
            success: true,
            status: 'success',
            totalExpenses,
            totalEntries,
            total: totalEntries - totalExpenses
        });
    }
);
