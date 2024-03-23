import Entry from '@/models/entryModel';
import { Response, Request, NextFunction } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { AppError } from '@/utils/AppError';
import { ObjectId } from 'mongoose';
import { Order } from '@cronjobs/interfaces/order.d';

export const createEntry = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { amount, description, name }: Entry = req.body;
        const { _id } = req.user;
        if (!amount || !description)
            return next(new AppError('Missing Data!', 400));

        const entry = await Entry.create({
            user: _id,
            amount,
            description,
            name,
        });
        res.status(200).json({
            entry,
            status: 'success',
            success: true,
        });
    },
);

export const getEntries = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
        const page = Number(req.query.page) ?? 1;
        const limit = Number(req.query.limit) ?? 20;

        const { _id } = req.user;
        const entries = await Entry.find({ user: _id })
            .sort({ createdAt: -1, _id: 1 })
            .skip((page - 1) * limit)
            .limit(limit);
        res.status(200).json({
            status: 'success',
            success: true,
            entries,
        });
    },
);

export const getEntry = asyncHandler(async (req: Request, res: Response) => {
    const { entryId } = req.params;
    const entry = await Entry.findById(entryId);
    res.json({
        status: 'success',
        success: true,
        entry,
    });
});

export const updateEntry = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { description, name, amount, repeat } = req.body;
        if (!description || !amount)
            return next(new AppError('Missing Data!', 400));
        const { entryId } = req.params;
        const entry = await Entry.findByIdAndUpdate(entryId, {
            description,
            amount,
            name,
            repeat,
        });
        res.json({
            success: true,
            status: 'success',
            entry,
        });
    },
);

export const deleteEntry = asyncHandler(async (req: Request, res: Response) => {
    const { entryId } = req.params;
    const deletedEntry = await Entry.findByIdAndDelete(entryId);
    res.json({
        status: 'success',
        success: true,
        deletedEntry,
    });
});

export const createEntriesByJson = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const data: Order[] = req.body.entries;
        if (!data || !data.length)
            return next(new AppError('Data not provided', 400));

        const orderIdsRegistered = [];
        for (let i = 0; i < data.length; i++) {
            const entry = await Entry.findOne({
                'binance.binanceId': data[i].orderId,
            });

            if (entry) orderIdsRegistered.push(data[i].orderId);
        }

        const formatedData: Entry[] = data
            .map((order) => {
                if (!orderIdsRegistered.includes(order.orderId)) {
                    orderIdsRegistered.push(order.orderId);
                    return {
                        name: order.note || 'alliance',
                        amount: Number(order.amount),
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
                                      order.date,
                                  )} and not edited. Please add what do you buy here: `,
                    };
                }
            })
            .filter((order) => Boolean(order));

        const ids = await Entry.create(formatedData);

        res.json({ success: true, status: 'success', expenses: ids });
    },
);
