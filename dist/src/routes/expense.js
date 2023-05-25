'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const express = require('express')
const expenseController_1 = require('../controllers/expenseController')
const authenticate_1 = require('../authenticate')
const router = express.Router()
router.route('/').get(authenticate_1.protect, expenseController_1.getExpenses).post(authenticate_1.protect, expenseController_1.createExpense)
router
  .route('/:expenseId')
  .get(authenticate_1.protect, expenseController_1.getExpense)
  .put(authenticate_1.protect, expenseController_1.updateExpense)
  .delete(authenticate_1.protect, expenseController_1.deleteExpense)
const expenseRouter = router
exports.default = expenseRouter
// # sourceMappingURL=expense.js.map
