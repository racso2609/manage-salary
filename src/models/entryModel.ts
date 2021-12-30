import {Document, Schema, model} from 'mongoose'
import { userInterface } from '../models/userModel';

interface entryInterface extends Document {
    amount: number;
    datesCharge: [Date];
    description: string;
    user: Schema.Types.ObjectId | userInterface;
    active: boolean;
    createAt: Date;
    updateAt: Date;
}

const EntryModel = new Schema<entryInterface>(
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

const Entry = model('Entry', EntryModel);
export { Entry, entryInterface };
