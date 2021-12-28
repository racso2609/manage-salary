import express = require('express');
import {
    createExpense,
    deleteExpense,
    getExpense,
    getExpenses,
} from '../controllers/expenseController';
import { protect } from '../authenticate';
const router = express.Router();

router.route('/').get(protect, getExpenses).post(protect, createExpense);
router
    .route('/:expendId')
    .get(protect, getExpense)
    .delete(protect, deleteExpense);

const expenseRouter = router;
export default expenseRouter;
