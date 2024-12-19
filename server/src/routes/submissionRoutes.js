import express from 'express';

import submissionControllers from '../controllers/submissionControllers.js';
import authMiddlewares from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/', submissionControllers.getList);
router.get('/info/:id', authMiddlewares.isAuth, authMiddlewares.isVerify, submissionControllers.get);
router.post('/submit', authMiddlewares.isAuth, authMiddlewares.isVerify, submissionControllers.submit);

export default router;
