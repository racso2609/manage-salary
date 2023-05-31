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
exports.createEntriesByJson = exports.deleteEntry = exports.updateEntry = exports.getEntry = exports.getEntries = exports.createEntry = void 0;
const entryModel_1 = require("../models/entryModel");
const asyncHandler_1 = require("../utils/asyncHandler");
const AppError_1 = require("../utils/AppError");
exports.createEntry = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, description, name } = req.body;
    const { _id } = req.user;
    if (!amount || !description)
        return next(new AppError_1.AppError('Missing Data!', 400));
    const entry = yield entryModel_1.Entry.create({
        user: _id,
        amount,
        description,
        name,
    });
    res.status(200).json({
        entry,
        status: 'success',
        success: true,
    });
}));
exports.getEntries = (0, asyncHandler_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const page = (_a = Number(req.query.page)) !== null && _a !== void 0 ? _a : 1;
    const limit = (_b = Number(req.query.limit)) !== null && _b !== void 0 ? _b : 20;
    const { _id } = req.user;
    const entries = yield entryModel_1.Entry.find({ user: _id })
        .sort({ createdAt: -1, _id: 1 })
        .skip((page - 1) * limit)
        .limit(limit);
    res.status(200).json({
        status: 'success',
        success: true,
        entries,
    });
}));
exports.getEntry = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { entryId } = req.params;
    const entry = yield entryModel_1.Entry.findById(entryId);
    res.json({
        status: 'success',
        success: true,
        entry,
    });
}));
exports.updateEntry = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { description, name, amount, repeat } = req.body;
    if (!description || !amount)
        return next(new AppError_1.AppError('Missing Data!', 400));
    const { entryId } = req.params;
    const entry = yield entryModel_1.Entry.findByIdAndUpdate(entryId, {
        description,
        amount,
        name,
        repeat,
    });
    res.json({
        success: true,
        status: 'success',
        entry,
    });
}));
exports.deleteEntry = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { entryId } = req.params;
    const deletedEntry = yield entryModel_1.Entry.findByIdAndDelete(entryId);
    res.json({
        status: 'success',
        success: true,
        deletedEntry,
    });
}));
exports.createEntriesByJson = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body.entries;
    if (!data || !data.length)
        return next(new AppError_1.AppError('Data not provided', 400));
    const orderIdsRegistered = [];
    for (let i = 0; i < data.length; i++) {
        const entry = yield entryModel_1.Entry.findOne({
            'binance.binanceId': data[i].orderId,
        });
        if (entry)
            orderIdsRegistered.push(data[i].orderId);
    }
    const formatedData = data
        .map((order) => {
        var _a;
        if (!orderIdsRegistered.includes(order.orderId)) {
            orderIdsRegistered.push(order.orderId);
            return {
                name: order.note || 'alliance',
                amount: Number(order.amount),
                binance: {
                    binanceId: order.orderId,
                    unitPrice: order.unitPrice,
                    fiat: order.fiat,
                    total: order.total,
                    asset: order.asset,
                    seller: order.seller,
                    date: new Date(order.date),
                    orderType: (_a = order.orderType) !== null && _a !== void 0 ? _a : 'P2P',
                },
                user: req.user._id,
                // TODO: add category unknown
                description: order.note &&
                    order.note !== '' &&
                    order.note !== ' '
                    ? order.note
                    : `this is a binance order created on ${new Date(order.date)} and not edited. Please add what do you buy here: `,
            };
        }
    })
        .filter((order) => Boolean(order));
    const ids = yield entryModel_1.Entry.create(formatedData);
    res.json({ success: true, status: 'success', expenses: ids });
}));
//# sourceMappingURL=entryController.js.map