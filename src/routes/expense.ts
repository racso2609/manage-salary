import express = require('express');
import {
    createExpense,
    createExpensesByJson,
    deleteExpense,
    getExpense,
    getExpenses,
    updateExpense,
} from '../controllers/expenseController';
import { apiKeyProtected, protect } from '../authenticate';
const router = express.Router();

router.route('/').get(protect, getExpenses).post(protect, createExpense);

router.route('/json').post(protect, createExpensesByJson);
router
    .route('/expense/:expenseId')
    .get(protect, getExpense)
    .put(protect, updateExpense)
    .delete(protect, deleteExpense);

router.route('/external/json').post(apiKeyProtected, createExpensesByJson);

const expenseRouter = router;
export default expenseRouter;
