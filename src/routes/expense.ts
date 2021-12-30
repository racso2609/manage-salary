import express = require('express');
import {
    createExpense,
    deleteExpense,
    getExpense,
    getExpenses,
    updateExpense
} from '../controllers/expenseController';
import { protect } from '../authenticate';
const router = express.Router();

router.route('/').get(protect, getExpenses).post(protect, createExpense);
router
    .route('/:expenseId')
    .get(protect, getExpense)
    .put(protect, updateExpense)
    .delete(protect, deleteExpense);

const expenseRouter = router;
export default expenseRouter;
