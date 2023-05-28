"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entry = void 0;
const mongoose_1 = require("mongoose");
const EntryModel = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { timestamps: true });
const Entry = (0, mongoose_1.model)('Entry', EntryModel);
exports.Entry = Entry;
//# sourceMappingURL=entryModel.js.map