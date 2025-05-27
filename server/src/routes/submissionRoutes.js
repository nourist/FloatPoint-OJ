import express from 'express';

import submissionControllers from '../controllers/submissionControllers.js';
import authMiddlewares from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/', authMiddlewares.isSoftAuth, submissionControllers.getList);
router.get('/info/:id', authMiddlewares.isAuth, submissionControllers.get);

router.post('/submit', authMiddlewares.isAuth, submissionControllers.submit);
router.delete('/delete/:id', authMiddlewares.requireAd, submissionControllers.deleteSubm);

export default router;
