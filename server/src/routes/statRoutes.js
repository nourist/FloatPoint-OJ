import express from 'express';

import authMiddlewares from '../middlewares/authMiddlewares.js';
import statControllers from '../controllers/statControllers.js';

const router = express.Router();

router.get('/', authMiddlewares.requireAd, statControllers.getStat);
router.get('/weekly-submission', authMiddlewares.requireAd, statControllers.getWeeklySubmisson);
router.get('/weekly-accepted', authMiddlewares.requireAd, statControllers.getWeeklyAccepted);
router.get('/monthly-submission', authMiddlewares.requireAd, statControllers.getMonthlySubmission);

export default router;
