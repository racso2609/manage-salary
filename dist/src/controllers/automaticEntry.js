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
exports.getAutomaticEntries = exports.getAutomaticEntry = exports.deleteAutomaticEntry = exports.activeAutomaticEntry = exports.updateAutomaticEntry = exports.createAutomaticEntry = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const AppError_1 = require("../utils/AppError");
const automaticEntryModel_1 = require("../models/automaticEntryModel");
exports.createAutomaticEntry = (0, asyncHandler_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, amount, description, dates } = req.body;
    const { _id } = req.user;
    const entry = yield automaticEntryModel_1.AutomaticEntry.create({
        name,
        amount,
        description,
        dates,
        active: true,
        user: _id,
    });
    res.json({
        success: true,
        status: 'success',
        entry,
    });
}));
exports.updateAutomaticEntry = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, amount, description, dates } = req.body;
    const { entryId } = req.params;
    const { _id } = req.user;
    let entry = yield automaticEntryModel_1.AutomaticEntry.findById(entryId);
    if (entry.user.toString() !== _id)
        return next(new AppError_1.AppError('You are not the owner!', 400));
    entry = yield automaticEntryModel_1.AutomaticEntry.findByIdAndUpdate(entryId, {
        name,
        amount,
        description,
        dates,
        active: true,
        user: _id,
    }, { new: true });
    res.json({
        success: true,
        status: 'success',
        entry,
    });
}));
exports.activeAutomaticEntry = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { active } = req.body;
    const { entryId } = req.params;
    const { _id } = req.user;
    let entry = yield automaticEntryModel_1.AutomaticEntry.findById(entryId);
    if (entry.user.toString() !== _id)
        return next(new AppError_1.AppError('You are not the owner!', 400));
    entry = yield automaticEntryModel_1.AutomaticEntry.findByIdAndUpdate(entryId, {
        active,
    }, { new: true });
    res.json({
        success: true,
        status: 'success',
        entry,
    });
}));
exports.deleteAutomaticEntry = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { entryId } = req.params;
    const { _id } = req.user;
    const entry = yield automaticEntryModel_1.AutomaticEntry.findById(entryId);
    if (entry.user.toString() !== _id)
        return next(new AppError_1.AppError('You are not the owner!', 400));
    const info = yield automaticEntryModel_1.AutomaticEntry.findByIdAndDelete(entryId);
    res.json({
        success: true,
        status: 'success',
        info,
    });
}));
exports.getAutomaticEntry = (0, asyncHandler_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { entryId } = req.params;
    const entry = yield automaticEntryModel_1.AutomaticEntry.findById(entryId);
    res.json({
        success: true,
        status: 'success',
        entry,
    });
}));
exports.getAutomaticEntries = (0, asyncHandler_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    const entries = yield automaticEntryModel_1.AutomaticEntry.find({ user: _id });
    res.json({
        success: true,
        status: 'success',
        entries,
    });
}));
//# sourceMappingURL=automaticEntry.js.map