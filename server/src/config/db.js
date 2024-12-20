import mongoose from 'mongoose';

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/FloatPoint');
		console.log(`Success connect to db ${process.env.DATABASE_URL ? '' : '(default)'}`);
	} catch (err) {
		console.error('Failed to connect to db', err);
	}
};

export default connectDB;
