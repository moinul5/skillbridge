import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRouter from './routes/api';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { loggerMiddleware } from './middlewares/logger';
import dbService from './services/db.service';
import { runSeed } from './config/seed';

// Load environment variables
dotenv.config();

const app = express();

// Security and utility middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(loggerMiddleware);

// Base API route
app.use('/api', apiRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the TravelMate AI Backend API!',
    endpoints: {
      health: '/health',
      api: '/api'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', database: dbService.isUsingMongo() ? 'mongodb' : 'json-file' });
});

// Route not found handling
app.use(notFoundHandler);

// Centralized error handling
app.use(errorHandler);

// Perform DB connection and check if seeding is needed
export const initApp = async () => {
  await dbService.connect();

  // Seeding check: If no items exist in DB, run the seed script
  try {
    const items = await dbService.findItems();
    if (items.length === 0) {
      console.log('Database empty on startup. Triggering auto-seeding...');
      await runSeed();
    }
  } catch (seedError) {
    console.error('Error during auto-seeding check:', seedError);
  }
};

export default app;
