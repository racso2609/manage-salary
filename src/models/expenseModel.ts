import { NextFunction } from 'express';
import { Document, Schema, model } from 'mongoose';
import Category from '@/models/categoriesModel';
import User from '@/models/userModel';

const DEFAULT_CATEGORY_NAME = 'unknown';

interface binanceExpenseInterface {
    binanceId: string;
    unitPrice: string;
    fiat: string;
    total: string;
    asset: string;
    seller: string;
    date: Date;
    orderType: string;
}

type Expense = {
    amount: number;
    category?: Schema.Types.ObjectId | Category;
    description: string;
    user: Schema.Types.ObjectId | User;
    binance: binanceExpenseInterface;
};

const ExpenseModel = new Schema<Expense & Document>(
    {
        amount: {
            type: Number,
            required: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: false,
            default: undefined,
        },
        description: {
            type: String,
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        binance: {
            binanceId: { type: String, unique: true },
            seller: String,
            unitPrice: { type: String },
            fiat: { type: String },
            total: { type: String },
            asset: { type: String },
            date: { type: Date },
            orderType: { type: String, default: 'P2P' },
        },
    },
    {
        timestamps: true,
    },
);

ExpenseModel.pre('save', async function (next: NextFunction) {
    if (this.category) return next();

    let unknownCategory = await Category.findOne({
        name: DEFAULT_CATEGORY_NAME,
    });
    if (!unknownCategory)
        await Category.create({ name: DEFAULT_CATEGORY_NAME });
    unknownCategory = await Category.findOne({ name: DEFAULT_CATEGORY_NAME });

    this.category = unknownCategory?._id;

    next();
});

const Expense = model('Expense', ExpenseModel);
export default Expense;
