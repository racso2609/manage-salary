'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const express_1 = require('express')
const authenticate_1 = require('../authenticate')
const dataController_1 = require('../controllers/dataController')
const router = (0, express_1.Router)()
router.get('/totals', authenticate_1.protect, dataController_1.getTotalAvaliable)
const dataRouter = router
exports.default = dataRouter
// # sourceMappingURL=data.js.map
