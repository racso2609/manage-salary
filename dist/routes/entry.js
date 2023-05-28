"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const entryController_1 = require("../controllers/entryController");
const authenticate_1 = require("../authenticate");
const router = express.Router();
router.route('/').get(authenticate_1.protect, entryController_1.getEntries).post(authenticate_1.protect, entryController_1.createEntry);
router
    .route('/entry/:entryId')
    .get(authenticate_1.protect, entryController_1.getEntry)
    .put(authenticate_1.protect, entryController_1.updateEntry)
    .delete(authenticate_1.protect, entryController_1.deleteEntry);
router.route('/json').post(authenticate_1.protect, entryController_1.createEntriesByJson);
router.route('/external/json').post(authenticate_1.apiKeyProtected, entryController_1.createEntriesByJson);
const entryRouter = router;
exports.default = entryRouter;
//# sourceMappingURL=entry.js.map