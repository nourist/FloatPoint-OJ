import express from 'express';

import userControllers from '../controllers/userControllers.js';
import authMiddlewares from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/', userControllers.getList);
router.get('/info/:name', userControllers.get);

export default router;
