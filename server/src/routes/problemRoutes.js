import express from 'express';

import problemControllers from '../controllers/problemControllers.js';
import authMiddlewares from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/', problemControllers.getList);
router.get('/info/:id', problemControllers.get);

router.post('/create', authMiddlewares.requireAd, problemControllers.create);
router.post('/edit/:id', authMiddlewares.requireAd, problemControllers.edit);
router.delete('/delete/:id', authMiddlewares.requireAd, problemControllers.delete);

export default router;
