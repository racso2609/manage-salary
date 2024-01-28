import { Document, Schema, model } from 'mongoose';
import { userInterface } from '@/models/userModel';

interface datesPeriod {
    date: string;
}

interface entryInterface extends Document {
    amount: number;
    datesCharge: [Date];
    description: string;
    user: Schema.Types.ObjectId | userInterface;
    createAt: Date;
    updateAt: Date;
    name: string;
    dates: [datesPeriod];
    active: Boolean;
}

const automaticEntryModel = new Schema<entryInterface>(
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
        dates: [
            {
                date: String,
            },
        ],
        active: Boolean,
    },
    { timestamps: true },
);

const AutomaticEntry = model('AutomaticEntry', automaticEntryModel);
export { AutomaticEntry, entryInterface };
