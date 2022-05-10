import { Document, Schema, model } from 'mongoose';
import { userInterface } from '../models/userModel';

interface entryInterface extends Document {
    amount: number;
    datesCharge: [Date];
    description: string;
    user: Schema.Types.ObjectId | userInterface;
    createAt: Date;
    updateAt: Date;
    name: string;
}

const EntryModel = new Schema<entryInterface>(
    {
        name: {
            type: String,
            required: true,
        },
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
    },
    { timestamps: true }
);

const Entry = model('Entry', EntryModel);
export { Entry, entryInterface };
