import express = require('express');
import { protect } from '../authenticate';
import {
    createAutomaticEntry,
    deleteAutomaticEntry,
    getAutomaticEntries,
    updateAutomaticEntry,
} from '../controllers/automaticEntry';
const router = express.Router();

router
    .route('/')
    .get(protect, getAutomaticEntries)
    .post(protect, createAutomaticEntry);
router
    .route('/:entryId')
    .get(protect, getAutomaticEntries)
    .put(protect, updateAutomaticEntry)
    .delete(protect, deleteAutomaticEntry);

const automaticEntry = router;
export default automaticEntry;
