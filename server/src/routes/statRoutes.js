import express from 'express';

import authMiddlewares from '../middlewares/authMiddlewares.js';
import statControllers from '../controllers/statControllers.js';

const router = express.Router();

router.get('/', authMiddlewares.requireAd, statControllers.getStat);
router.get('/weekly-submission', authMiddlewares.requireAd, statControllers.getWeeklySubmisson);
router.get('/weekly-accepted', authMiddlewares.requireAd, statControllers.getWeeklyAccepted);
router.get('/monthly-submission', authMiddlewares.requireAd, statControllers.getMonthlySubmission);
router.get('/monthly-language', authMiddlewares.requireAd, statControllers.getMonthlyLanguage);
router.get('/newest-activity', authMiddlewares.requireAd, statControllers.getNewestActivity);
router.get('/problem/:id', authMiddlewares.requireAd, statControllers.getProblemStat);
router.get('/daily-submission', authMiddlewares.requireAd, statControllers.getDailySubmission);

export default router;
