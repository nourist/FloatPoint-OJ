import jwt from 'jsonwebtoken';

import User from '../models/user.js';

const authMiddlewares = {
	async isAuth(req, res, next) {
		try {
			const token = req.cookies.token;

			if (!token) {
				return res.status(401).json({ success: false, message: 'Unauthorized - no token provided' });
			}

			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			if (!decoded) {
				return res.status(401).json({ success: false, message: 'Unauthorized - invalid token' });
			}

			const user = await User.findById(req.userId);

			if (!user.isVerified) {
				return res.status(401).json({ success: false, message: 'Unauthorized - unverified' });
			}

			req.userId = decoded.userId;
			req.userPermission = user.permission;

			next();
		} catch (err) {
			res.status(500).json({ success: false, msg: 'Server error' });

			console.error(`Error in checking auth: ${err.message}`);
		}
	},

	async isSoftAuth(req, res, next) {
		try {
			const token = req.cookies.token;

			if (!token) {
				next();
			}

			const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });

			if (!decoded) {
				next();
			}

			const user = await User.findById(decoded.userId);

			if (!user.isVerified) {
				next();
			}

			req.userId = decoded.userId;
			req.userPermission = user.permission;

			next();
		} catch (err) {
			res.status(500).json({ success: false, msg: 'Server error' });

			console.error(`Error in checking auth: ${err.message}`);
		}
	},

	requireAd(req, res, next) {
		try {
			if (req.userPermission != 'Admin') {
				return res.status(401).json({ success: false, message: 'Unauthorized - admin permission required' });
			}

			next();
		} catch (err) {
			res.status(500).json({ success: false, msg: 'Server error' });

			console.error(`Error in checking user permission: ${err.message}`);
		}
	},
};

authMiddlewares.requireAd = [authMiddlewares.isAuth, authMiddlewares.requireAd];

export default authMiddlewares;
