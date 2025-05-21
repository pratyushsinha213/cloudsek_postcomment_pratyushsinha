import cookieParser from 'cookie-parser'
import express from 'express';
const app = express();

import { PORT } from './config/env.js';
import connectDB from './config/db.js';
import userRouter from './routes/user.routes.js';
import postRouter from './routes/post.routes.js';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT || 5000, () => {
    console.log(`Post Comments Service is running on http://localhost:${PORT}`);
    connectDB();
});