import express from 'express';

import problemControllers from '../controllers/problemControllers.js';
import authMiddlewares from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/list', problemControllers.getList);
router.get('/info/:id', problemControllers.get);
router.post('/create', authMiddlewares.isAuth, authMiddlewares.requireAd, problemControllers.create);
router.post('/edit/:id', authMiddlewares.isAuth, authMiddlewares.requireAd, problemControllers.edit);

export default router;
