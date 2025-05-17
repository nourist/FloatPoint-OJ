import express from 'express';

import authMiddlewares from '../middlewares/authMiddlewares.js';
import statControllers from '../controllers/statControllers.js';

const router = express.Router();

router.get('/', authMiddlewares.requireAd, statControllers.getStat);
router.get('/weekly-submission', authMiddlewares.requireAd, statControllers.getWeeklySubmisson);
router.get('/today-submission', authMiddlewares.requireAd, statControllers.getTodaySubmission);

export default router;
