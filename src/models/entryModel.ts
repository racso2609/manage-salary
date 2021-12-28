import mongoose = require('mongoose');
import { userInterface } from '../models/userModel';
const Schema = mongoose.Schema;

interface entryInterface {
    amount: number;
    datesCharge: [Date];
    description: string;
    user: mongoose.Schema.Types.ObjectId | userInterface;
    createAt: Date;
    updateAt: Date;
}

const EntryModel = new Schema(
    {
        amount: {
            type: Number,
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
        active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Entry = mongoose.model('Entry', EntryModel);
export { Entry, entryInterface };
