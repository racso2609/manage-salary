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
exports.createCategory = exports.getCategories = void 0
const categoriesModel_1 = require('../models/categoriesModel')
const asyncHandler_1 = require('../utils/asyncHandler')
const AppError_1 = require('../utils/AppError')
exports.getCategories = (0, asyncHandler_1.asyncHandler)((_req, res) => __awaiter(void 0, void 0, void 0, function * () {
  const categories = yield categoriesModel_1.Category.find()
  res.json({
    success: true,
    status: 'success',
    categories
  })
}))
exports.createCategory = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function * () {
  const { name } = req.body
  if (!name) { return next(new AppError_1.AppError('Please select a valid name!', 400)) }
  const category = yield categoriesModel_1.Category.create({ name })
  res.json({
    success: true,
    status: 'success',
    category
  })
}))
// # sourceMappingURL=categoriesController.js.map
