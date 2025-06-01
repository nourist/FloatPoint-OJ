import express from 'express';

import userControllers from '../controllers/userControllers.js';
import authMiddlewares from '../middlewares/authMiddlewares.js';
import { uploadAvatar } from '../config/multer.js';

const router = express.Router();

router.get('/', userControllers.getList);
router.get('/info/:name', userControllers.get);
router.post('/edit', authMiddlewares.isAuth, userControllers.edit);
router.post('/change-avatar', authMiddlewares.isAuth, uploadAvatar.single('file'), userControllers.changeAvatar);
router.delete('/delete/:name', authMiddlewares.requireAd, userControllers.deleteUser);

export default router;
