import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { Entry } from '@/models/entryModel';
import { Expense } from '@/models/expenseModel';
import { Types } from 'mongoose';
const ObjectId = Types.ObjectId;

export const getTotalAvaliable = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
        const { _id } = req.user;
        const expenses = await Expense.aggregate([
            { $match: { user: new ObjectId(_id) } },
            { $group: { _id: '', totalExpense: { $sum: '$amount' } } },
        ]);

        const totalExpenses = expenses[0] ? expenses[0]?.totalExpense : 0;

        const entries = await Entry.aggregate([
            { $match: { user: new ObjectId(_id) } },
            { $group: { _id: '', totalEntry: { $sum: '$amount' } } },
        ]);
        const totalEntries = entries[0] ? entries[0].totalEntry : 0;

        res.json({
            success: true,
            status: 'success',
            totalExpenses,
            totalEntries,
            total: totalEntries - totalExpenses,
        });
    },
);
