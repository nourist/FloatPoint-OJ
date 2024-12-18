import 'dotenv/config';

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import path from 'path';

import route from './routes/index.js';

const app = express();

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/FloatPoint');
		console.log(`Success connect to db ${process.env.DATABASE_URL ? '' : '(default)'}`);
	} catch (err) {
		console.error('Failed to connect to db', err);
	}
};

connectDB();

app.use(express.static(path.join(path.resolve(), 'uploads')));

app.use(
	express.urlencoded({
		extended: true,
	}),
);

app.use(
	cors({
		origin: [process.env.CLIENT_URL],
		credentials: true,
	}),
);

app.use(express.json());
app.use(cookieParser());

app.use(morgan('combined'));

route(app);

app.listen(process.env.PORT || 8080, () =>
	console.log(`Server listening on port ${process.env.PORT || 8080} ${process.env.PORT ? '' : '(default)'}`),
);
