import jwt from 'jsonwebtoken';

import User from '../models/user.js';

const authMiddlewares = {
	isAuth(req, res, next) {
		const token = req.cookies.token;
		try {
			if (!token) {
				return res.status(401).json({ success: false, message: 'Unauthorized - no token provided' });
			}

			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			if (!decoded) {
				return res.status(401).json({ success: false, message: 'Unauthorized - invalid token' });
			}

			req.userId = decoded.userId;
			next();
		} catch (err) {
			res.status(500).json({ success: false, msg: 'Server error' });

			console.error(`Error in checking auth: ${err.message}`);
		}
	},

	async isVerify(req, res, next) {
		//require isAuth middleware
		try {
			const user = await User.findById(req.userId);

			if (!user.isVerified) {
				return res.status(401).json({ success: false, message: 'Unauthorized - unverified' });
			}

			next();
		} catch (err) {
			res.status(500).json({ success: false, msg: 'Server error' });

			console.error(`Error in checking user verification: ${err.message}`);
		}
	},

	async requireAd(req, res, next) {
		//require isAuth middleware

		try {
			const user = await User.findById(req.userId);

			if (!user.isVerified) {
				return res.status(401).json({ success: false, message: 'Unauthorized - unverified' });
			}

			if (user.permission != 'Admin') {
				return res.status(401).json({ success: false, message: 'Unauthorized - admin permission required' });
			}

			next();
		} catch (err) {
			res.status(500).json({ success: false, msg: 'Server error' });

			console.error(`Error in checking user permission: ${err.message}`);
		}
	},
};

export default authMiddlewares;
