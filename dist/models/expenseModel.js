"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expense = void 0;
const mongoose_1 = require("mongoose");
const categoriesModel_1 = require("./categoriesModel");
const DEFAULT_CATEGORY_NAME = 'unknown';
const ExpenseModel = new mongoose_1.Schema({
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category',
        required: false,
        default: undefined,
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
}, {
    timestamps: true,
});
ExpenseModel.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.category)
            return next();
        let unknownCategory = yield categoriesModel_1.Category.findOne({
            name: DEFAULT_CATEGORY_NAME,
        });
        if (!unknownCategory)
            yield categoriesModel_1.Category.create({ name: DEFAULT_CATEGORY_NAME });
        unknownCategory = yield categoriesModel_1.Category.findOne({ name: DEFAULT_CATEGORY_NAME });
        this.category = unknownCategory === null || unknownCategory === void 0 ? void 0 : unknownCategory._id;
        next();
    });
});
const Expense = (0, mongoose_1.model)('Expense', ExpenseModel);
exports.Expense = Expense;
//# sourceMappingURL=expenseModel.js.map