import express from 'express';

import contestControllers from '../controllers/contestControllers.js';
import authMiddlewares from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/', contestControllers.getList);
router.get('/info/:id', contestControllers.get);
router.get('/submissions/:id', authMiddlewares.isVerify, contestControllers.submissions);

router.post('/join', authMiddlewares.isVerify, contestControllers.join);
router.post('/leave', authMiddlewares.isVerify, contestControllers.leave);

router.post('/create', authMiddlewares.requireAd, contestControllers.create);
router.post('/edit/:id', authMiddlewares.requireAd, contestControllers.edit);
router.post('/add-problem/:id', authMiddlewares.requireAd, contestControllers.addProblem);
router.post('/edit-problem/:id', authMiddlewares.requireAd, contestControllers.editProblem);
router.post('/remove-problem/:id', authMiddlewares.requireAd, contestControllers.removeProblem);
router.delete('/delete/:id', authMiddlewares.requireAd, contestControllers.delete);

export default router;
