import express = require('express');
const router = express.Router();

import {
    signup,
    login,
    updateProfile,
    verifyEmail,
    forgotPassword,
    getLoggedInUser,
    getProfile,
    resetPassword,
    generateApiKey,
} from '../controllers/authController';
import { protect } from '../authenticate';

router.post('/signup', signup);
router.post('/login', login);
router.get('/verify-email/:emailVerificationCode', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword);
router.get('/current-user', protect, getLoggedInUser);
router.get('/create-api-key', protect, generateApiKey);
router.get('/get-api-key', protect, getApiKey);

router.route('/profile').get(protect, getProfile).put(protect, updateProfile);

const userRoter = router;
export default userRoter;
