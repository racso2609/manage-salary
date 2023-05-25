'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.AutomaticEntry = void 0
const mongoose_1 = require('mongoose')
const automaticEntryModel = new mongoose_1.Schema({
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
  },
  dates: [
    {
      date: String
    }
  ],
  active: Boolean
}, { timestamps: true })
const AutomaticEntry = (0, mongoose_1.model)('AutomaticEntry', automaticEntryModel)
exports.AutomaticEntry = AutomaticEntry
// # sourceMappingURL=automaticEntryModel.js.map
