import { NextFunction, Request, Response } from 'express';

import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { AutomaticEntry } from '../models/automaticEntryModel';

export const createAutomaticEntry = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
        const { name, amount, description, dates } = req.body;
        const { _id } = req.user;
        const entry = await AutomaticEntry.create({
            name,
            amount,
            description,
            dates,
            active: true,
            user: _id,
        });

        res.json({
            success: true,
            status: 'success',
            entry,
        });
    }
);

export const updateAutomaticEntry = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { name, amount, description, dates } = req.body;
        const { entryId } = req.params;
        const { _id } = req.user;

        let entry = await AutomaticEntry.findById(entryId);
        if (entry.user.toString() !== _id)
            return next(new AppError('You are not the owner!', 400));

        entry = await AutomaticEntry.findByIdAndUpdate(
            entryId,
            {
                name,
                amount,
                description,
                dates,
                active: true,
                user: _id,
            },
            { new: true }
        );

        res.json({
            success: true,
            status: 'success',
            entry,
        });
    }
);

export const activeAutomaticEntry = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { active } = req.body;
        const { entryId } = req.params;
        const { _id } = req.user;

        let entry = await AutomaticEntry.findById(entryId);
        if (entry.user.toString() !== _id)
            return next(new AppError('You are not the owner!', 400));

        entry = await AutomaticEntry.findByIdAndUpdate(
            entryId,
            {
                active,
            },
            { new: true }
        );

        res.json({
            success: true,
            status: 'success',
            entry,
        });
    }
);

export const deleteAutomaticEntry = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { entryId } = req.params;
        const { _id } = req.user;

        const entry = await AutomaticEntry.findById(entryId);
        if (entry.user.toString() !== _id)
            return next(new AppError('You are not the owner!', 400));

        const info = await AutomaticEntry.findByIdAndDelete(entryId);

        res.json({
            success: true,
            status: 'success',
            info,
        });
    }
);

export const getAutomaticEntry = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
        const { entryId } = req.params;

        const entry = await AutomaticEntry.findById(entryId);
        res.json({
            success: true,
            status: 'success',
            entry,
        });
    }
);

export const getAutomaticEntries = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
        const { _id } = req.user;

        const entries = await AutomaticEntry.find({ user: _id });
        res.json({
            success: true,
            status: 'success',
            entries,
        });
    }
);
