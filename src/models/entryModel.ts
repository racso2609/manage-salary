import { Document, Schema, model } from 'mongoose';
import User from '@/models/userModel';

interface binanceEntryInterface {
    binanceId: string;
    unitPrice: string;
    fiat: string;
    total: string;
    asset: string;
    seller: string;
    date: Date;
    orderType: string;
}
interface Entry {
    amount: number;
    description: string;
    user: Schema.Types.ObjectId | User;
    createAt?: Date;
    updateAt?: Date;
    name: string;
    binance: binanceEntryInterface;
}

const EntryModel = new Schema<Entry & Document>(
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
    { timestamps: true },
);

const Entry = model('Entry', EntryModel);
export default Entry;
