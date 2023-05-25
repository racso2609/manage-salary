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
exports.getTotalAvaliable = void 0
const asyncHandler_1 = require('../utils/asyncHandler')
const entryModel_1 = require('../models/entryModel')
const expenseModel_1 = require('../models/expenseModel')
const mongoose_1 = require('mongoose')
const ObjectId = mongoose_1.Types.ObjectId
exports.getTotalAvaliable = (0, asyncHandler_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function * () {
  let _a
  const { _id } = req.user
  const expenses = yield expenseModel_1.Expense.aggregate([
    { $match: { user: new ObjectId(_id) } },
    { $group: { _id: '', totalExpense: { $sum: '$amount' } } }
  ])
  const totalExpenses = expenses[0] ? (_a = expenses[0]) === null || _a === void 0 ? void 0 : _a.totalExpense : 0
  const entries = yield entryModel_1.Entry.aggregate([
    { $match: { user: new ObjectId(_id) } },
    { $group: { _id: '', totalEntry: { $sum: '$amount' } } }
  ])
  const totalEntries = entries[0] ? entries[0].totalEntry : 0
  res.json({
    success: true,
    status: 'success',
    totalExpenses,
    totalEntries,
    total: totalEntries - totalExpenses
  })
}))
// # sourceMappingURL=dataController.js.map
