'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.Entry = void 0
const mongoose_1 = require('mongoose')
const EntryModel = new mongoose_1.Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  user: {
    type: mongoose_1.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true })
const Entry = (0, mongoose_1.model)('Entry', EntryModel)
exports.Entry = Entry
// # sourceMappingURL=entryModel.js.map
