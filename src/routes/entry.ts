import express = require('express');
import {
    getEntries,
    createEntry,
    getEntry,
    updateEntry,
    deleteEntry,
    createEntriesByJson,
} from '../controllers/entryController';
import { apiKeyProtected, protect } from '../authenticate';
const router = express.Router();

router.route('/').get(protect, getEntries).post(protect, createEntry);
router
    .route('/entry/:entryId')
    .get(protect, getEntry)
    .put(protect, updateEntry)
    .delete(protect, deleteEntry);

router.route('/json').post(protect, createEntriesByJson);
router.route('/external/json').post(apiKeyProtected, createEntriesByJson);

const entryRouter = router;
export default entryRouter;
