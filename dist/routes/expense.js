"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const expenseController_1 = require("../controllers/expenseController");
const authenticate_1 = require("../authenticate");
const router = express.Router();
router
    .route('/')
    .get(authenticate_1.protect, expenseController_1.getExpenses)
    .post(authenticate_1.protect, expenseController_1.createExpense)
    .delete(authenticate_1.protect, expenseController_1.deleteExpenses);
router.route('/json').post(authenticate_1.protect, expenseController_1.createExpensesByJson);
router
    .route('/expense/:expenseId')
    .get(authenticate_1.protect, expenseController_1.getExpense)
    .put(authenticate_1.protect, expenseController_1.updateExpense)
    .delete(authenticate_1.protect, expenseController_1.deleteExpense);
router.route('/external/json').post(authenticate_1.apiKeyProtected, expenseController_1.createExpensesByJson);
const expenseRouter = router;
exports.default = expenseRouter;
//# sourceMappingURL=expense.js.map