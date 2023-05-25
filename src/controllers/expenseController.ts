import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { Response, Request, NextFunction } from 'express';
import { expenseInterface, Expense } from '../models/expenseModel';
import { BNOrder } from 'src/interfaces/binance/order';
import { ObjectId } from 'mongoose';

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
    const { page, limit } = req.body;
    const { _id } = req.user;
    const expends = await Expense.find({ user: _id })
        .skip(page * limit)
        .limit(limit ?? 20);

    res.json({
        status: 'success',
        success: true,
        expends,
    });
});

export const getExpense = asyncHandler(async (req: Request, res: Response) => {
    const { expenseId } = req.params;
    const expend = await Expense.findById(expenseId);
    res.json({
        success: true,
        status: 'success',
        expend,
    });
});

export const deleteExpense = asyncHandler(
    async (req: Request, res: Response) => {
        const { expenseId } = req.params;
        const deletedExpend = await Expense.findByIdAndDelete(expenseId);
        res.json({
            status: 'success',
            success: true,
            deletedExpend,
        });
    }
);

export const deleteExpenses = asyncHandler(
    async (req: Request, res: Response) => {
        const { _id } = req.user;
        const deletedExpenses = await Expense.deleteMany({
            user: _id as unknown as ObjectId,
        });

        res.json({
            status: 'success',
            success: true,
            deletedExpenses,
        });
    }
);

export const updateExpense = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
        const { expenseId } = req.params;
        const { description, amount, category } = req.body;

        const expense = await Expense.findByIdAndUpdate(
            expenseId,
            {
                description,
                category,
                amount,
            },
            { new: true }
        );
        res.json({
            status: 'success',
            success: true,
            expense,
        });
    }
);

export const createExpensesByJson = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const data: BNOrder[] = req.body.expenses;
        if (!data || !data.length)
            return next(new AppError('Data not provided', 400));

        const orderIdsRegistered = [];
        for (let i = 0; i < data.length; i++) {
            const expense = await Expense.findOne({
                'binance.binanceId': data[i].orderId,
            });

            if (expense) orderIdsRegistered.push(data[i].orderId);
        }

        const formatedData: expenseInterface[] = data
            .map((order) => {
                if (!orderIdsRegistered.includes(order.orderId)) {
                    orderIdsRegistered.push(order.orderNumber);
                    return {
                        amount: order.amount,
                        binance: {
                            binanceId: order.orderId,
                            unitPrice: order.unitPrice,
                            fiat: order.fiat,
                            total: order.total,
                            asset: order.asset,
                            seller: order.seller,
                            date: new Date(order.date),
                            orderType: order.orderType ?? 'P2P',
                        },
                        user: req.user._id as unknown as ObjectId,
                        // TODO: add category unknown
                        description:
                            order.note &&
                            order.note !== '' &&
                            order.note !== ' '
                                ? order.note
                                : `this is a binance order created on ${new Date(
                                      order.createTime
                                  )} and not edited. Please add what do you buy here: `,
                    };
                }
            })
            .filter((order) => Boolean(order));
        if (formatedData.length === 0)
            return next(new AppError('Not correct data send', 500));

        const ids = await Expense.create(formatedData);

        res.json({ success: true, status: 'success', expenses: ids });
    }
);
