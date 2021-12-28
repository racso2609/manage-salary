import mongoose = require('mongoose');
import { categoryInterface } from './categoriesModel';
const Schema = mongoose.Schema;

interface expenseInterface {
    amount: number;
    category: mongoose.Schema.Types.ObjectId | categoryInterface;
    description: string;
}

const expenseModel = new Schema(
    {
        amount: {
            type: Number,
            required: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
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
    },
    {
        timestamps: true,
    }
);

const Expense = mongoose.model('Expense', expenseModel);
export { Expense, expenseInterface };
