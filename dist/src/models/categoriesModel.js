'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.Category = void 0
const mongoose_1 = require('mongoose')
const CategoryModel = new mongoose_1.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
})
const Category = (0, mongoose_1.model)('Category', CategoryModel)
exports.Category = Category
// # sourceMappingURL=categoriesModel.js.map
