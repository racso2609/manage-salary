import { Document, Schema, model } from 'mongoose';
import User from '@/models/userModel';
import { INTEGRATIONS as EntryOptions } from '@/interfaces/EntryAndExpensesManagers';

type BinanceRegister = {
    binanceId: string;
    unitPrice: string;
    fiat: string;
    total: string;
    asset: string;
    seller: string;
    date: Date;
    orderType: string;
};

type EntryType = {
    type: EntryOptions.BINANCE;
    binance: BinanceRegister;
};

type Entry = {
    amount: number;
    description: string;
    user: Schema.Types.ObjectId | User;
    createAt?: Date;
    updateAt?: Date;
    name: string;
} & EntryType;

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
        type: {
            enum: Object.values(EntryOptions),
            default: EntryOptions.BINANCE,
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
            required: function () {
                return this.type === EntryOptions.BINANCE;
            },
        },
    },
    { timestamps: true },
);

const Entry = model('Entry', EntryModel);
export default Entry;
