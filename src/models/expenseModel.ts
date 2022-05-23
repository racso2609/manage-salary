import { Document, Schema, model } from 'mongoose';
import { categoryInterface } from './categoriesModel';
import { userInterface } from './userModel';

interface expenseInterface extends Document {
    amount: number;
    category: Schema.Types.ObjectId | categoryInterface;
    description: string;
    user: Schema.Types.ObjectId | userInterface;
}

const expenseModel = new Schema<expenseInterface>(
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

const Expense = model('Expense', expenseModel);
export { Expense, expenseInterface };
