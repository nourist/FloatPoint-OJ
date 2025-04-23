import express from 'express';

import problemControllers from '../controllers/problemControllers.js';
import authMiddlewares from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/', authMiddlewares.isSoftAuth, problemControllers.getList);
router.get('/info/:id', authMiddlewares.isSoftAuth, problemControllers.get);
router.get('/tags', authMiddlewares.isSoftAuth, problemControllers.getTags);
router.get('/languages', problemControllers.getLanguages);

router.post('/create', authMiddlewares.requireAd, problemControllers.create);
router.post('/edit/:id', authMiddlewares.requireAd, problemControllers.edit);
router.delete('/delete/:id', authMiddlewares.requireAd, problemControllers.delete);

export default router;
