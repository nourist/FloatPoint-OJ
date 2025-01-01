import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

import cloudinary from './cloudinary.js';

const avatarStorage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: 'avatar',
		allowed_formats: ['jpg', 'png', 'jpeg'],
		public_id: (req, file) => req.userId,
	},
});

export const uploadAvatar = multer({ storage: avatarStorage });
