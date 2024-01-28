import express = require('express');
import { protect } from '@/authenticate';
import {
    getCategories,
    createCategory,
} from '@/controllers/categoriesController';

const router = express.Router();

router.route('/').get(protect, getCategories).post(protect, createCategory);

const categoryRouter = router;
export default categoryRouter;
