import { Entry, entryInterface } from '../models/entryModel';
import { Response, Request, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

export const createEntry = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { amount, description, name }: entryInterface = req.body;
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
    }
);

export const getEntries = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
        const { _id } = req.user;
        const entries = await Entry.find({ user: _id });
        res.status(200).json({
            status: 'success',
            success: true,
            entries,
        });
    }
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

export const toggleEntry = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { entryId } = req.params;
        const oldEntry = await Entry.findById(entryId);
        if (!oldEntry) return next(new AppError('Entry do not exist!', 404));

        const active = !oldEntry.active;
        const entry = await Entry.findByIdAndUpdate(
            entryId,
            { active },
            { new: true }
        );
        res.json({ success: true, status: 'success', entry });
    }
);

export const updateEntry = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { description, amount } = req.body;
        if (!description || !amount)
            return next(new AppError('Missing Data!', 400));
        const { entryId } = req.params;
        const entry = await Entry.findByIdAndUpdate(entryId, {
            description,
            amount,
        });
        res.json({
            success: true,
            status: 'success',
            entry,
        });
    }
);
