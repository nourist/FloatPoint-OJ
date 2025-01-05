import express from 'express';

import contestControllers from '../controllers/contestControllers.js';
import authMiddlewares from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/', contestControllers.getList);
router.get('/info/:id', contestControllers.get);

router.post('/join', authMiddlewares.isAuth, contestControllers.join);
router.post('/leave', authMiddlewares.isAuth, contestControllers.leave);

router.post('/create', authMiddlewares.requireAd, contestControllers.create);
router.post('/edit/:id', authMiddlewares.requireAd, contestControllers.edit);
router.post('/add-problem/:id', authMiddlewares.requireAd, contestControllers.addProblem);
router.post('/edit-problem/:id', authMiddlewares.requireAd, contestControllers.editProblem);
router.post('/remove-problem/:id', authMiddlewares.requireAd, contestControllers.removeProblem);
router.delete('/delete/:id', authMiddlewares.requireAd, contestControllers.delete);

export default router;
