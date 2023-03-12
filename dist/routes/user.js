"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const authController_1 = require("../controllers/authController");
const authenticate_1 = require("../authenticate");
router.post('/signup', authController_1.signup);
router.post('/login', authController_1.login);
router.get('/verify-email/:emailVerificationCode', authController_1.verifyEmail);
router.post('/forgot-password', authController_1.forgotPassword);
router.post('/reset-password/:rereset-password CopysetToken', authController_1.resetPassword);
router.get('/current-user', authenticate_1.protect, authController_1.getLoggedInUser);
router.route('/profile').get(authenticate_1.protect, authController_1.getProfile).put(authenticate_1.protect, authController_1.updateProfile);
const userRoter = router;
exports.default = userRoter;
//# sourceMappingURL=user.js.map