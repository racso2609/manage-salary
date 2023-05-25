'use strict'
const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt (value) { return value instanceof P ? value : new P(function (resolve) { resolve(value) }) }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled (value) { try { step(generator.next(value)) } catch (e) { reject(e) } }
    function rejected (value) { try { step(generator.throw(value)) } catch (e) { reject(e) } }
    function step (result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected) }
    step((generator = generator.apply(thisArg, _arguments || [])).next())
  })
}
Object.defineProperty(exports, '__esModule', { value: true })
exports.deleteEntry = exports.updateEntry = exports.getEntry = exports.getEntries = exports.createEntry = void 0
const entryModel_1 = require('../models/entryModel')
const asyncHandler_1 = require('../utils/asyncHandler')
const AppError_1 = require('../utils/AppError')
exports.createEntry = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function * () {
  const { amount, description, name } = req.body
  const { _id } = req.user
  if (!amount || !description) { return next(new AppError_1.AppError('Missing Data!', 400)) }
  const entry = yield entryModel_1.Entry.create({
    user: _id,
    amount,
    description,
    name
  })
  res.status(200).json({
    entry,
    status: 'success',
    success: true
  })
}))
exports.getEntries = (0, asyncHandler_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function * () {
  const { _id } = req.user
  const entries = yield entryModel_1.Entry.find({ user: _id })
  res.status(200).json({
    status: 'success',
    success: true,
    entries
  })
}))
exports.getEntry = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function * () {
  const { entryId } = req.params
  const entry = yield entryModel_1.Entry.findById(entryId)
  res.json({
    status: 'success',
    success: true,
    entry
  })
}))
exports.updateEntry = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function * () {
  const { description, name, amount, repeat } = req.body
  if (!description || !amount) { return next(new AppError_1.AppError('Missing Data!', 400)) }
  const { entryId } = req.params
  const entry = yield entryModel_1.Entry.findByIdAndUpdate(entryId, {
    description,
    amount,
    name,
    repeat
  })
  res.json({
    success: true,
    status: 'success',
    entry
  })
}))
exports.deleteEntry = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function * () {
  const { entryId } = req.params
  const deletedEntry = yield entryModel_1.Entry.findByIdAndDelete(entryId)
  res.json({
    status: 'success',
    success: true,
    deletedEntry
  })
}))
// # sourceMappingURL=entryController.js.map
