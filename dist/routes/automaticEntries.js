"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const authenticate_1 = require("../authenticate");
const automaticEntry_1 = require("../controllers/automaticEntry");
const router = express.Router();
router
    .route('/')
    .get(authenticate_1.protect, automaticEntry_1.getAutomaticEntries)
    .post(authenticate_1.protect, automaticEntry_1.createAutomaticEntry);
router
    .route('/:entryId')
    .get(authenticate_1.protect, automaticEntry_1.getAutomaticEntries)
    .put(authenticate_1.protect, automaticEntry_1.updateAutomaticEntry)
    .delete(authenticate_1.protect, automaticEntry_1.deleteAutomaticEntry);
const automaticEntry = router;
exports.default = automaticEntry;
//# sourceMappingURL=automaticEntries.js.map