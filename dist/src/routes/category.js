'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const express = require('express')
const authenticate_1 = require('../authenticate')
const categoriesController_1 = require('../controllers/categoriesController')
const router = express.Router()
router.route('/').get(authenticate_1.protect, categoriesController_1.getCategories).post(authenticate_1.protect, categoriesController_1.createCategory)
const categoryRouter = router
exports.default = categoryRouter
// # sourceMappingURL=category.js.map
