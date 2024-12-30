import express from 'express';

import submissionControllers from '../controllers/submissionControllers.js';
import authMiddlewares from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/', authMiddlewares.isSoftAuth, submissionControllers.getList);
router.get('/info/:id', authMiddlewares.isVerify, submissionControllers.get);

router.post('/submit', authMiddlewares.isVerify, submissionControllers.submit);

export default router;
