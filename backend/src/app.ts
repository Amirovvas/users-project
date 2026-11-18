import express, { Application } from 'express';
import cors from 'cors';
import apiRouter from './routes';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';

const app: Application = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Root Router
app.use('/api', apiRouter);

// 404 Not Found Handler
app.use(notFound);

// Centralized Error Handler
app.use(errorHandler);

export default app;
