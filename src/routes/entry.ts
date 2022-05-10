import express = require('express');
import {
    getEntries,
    createEntry,
    getEntry,
    updateEntry,
} from '../controllers/entryController';
import { protect } from '../authenticate';
const router = express.Router();

router.route('/').get(protect, getEntries).post(protect, createEntry);
router.route('/:entryId').get(protect, getEntry).put(protect, updateEntry);

const entryRouter = router;
export default entryRouter;
