import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/categoriesModel';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

export const getCategories = asyncHandler(
    async (_req: Request, res: Response) => {
        const categories = await Category.find();
        res.json({
            success: true,
            status: 'success',
            categories,
        });
    }
);

export const createCategory = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { name }: { name: string } = req.body;
        if (!name)
            return next(new AppError('Please select a valid name!', 400));
        const category = await Category.create({ name });

        res.json({
            success: true,
            status: 'success',
            category,
        });
    }
);
