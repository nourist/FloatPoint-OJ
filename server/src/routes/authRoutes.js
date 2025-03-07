import express from 'express';

import authControllers from '../controllers/authControllers.js';
import authMiddlewares from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/', authMiddlewares.isAuth, authControllers.getSelfInfo);

router.post('/signup', authControllers.signup);
router.post('/login', authControllers.login);
router.post('/logout', authControllers.logout);

router.post('/re-send-verify', authControllers.reSendVerificationCode);
router.post('/verify-email/:code', authControllers.verifyEmail);

router.post('/forgot-password', authControllers.forgotPassword);
router.post('/reset-password/:token', authControllers.resetPassword);

export default router;
