import 'dotenv/config';

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import path from 'path';

const app = express();

const connectDB = async () => {
	try {
		if (!process.env.DATABASE_URL) {
			throw new Error("ERROR: couldn't find DATABASE_URL from env!!");
		}
		await mongoose.connect(process.env.DATABASE_URL);
		console.log('Success connect to db');
	} catch (err) {
		console.error('Failed to connect to db', err);
	}
};

connectDB();

// app.use(express.static(path.join(path.resolve(), 'uploads')));

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

app.listen(process.env.PORT || 8080, () =>
	console.log(`Server listening on port ${process.env.PORT || 8080} ${process.env.PORT ? '' : '(default)'}`),
);
