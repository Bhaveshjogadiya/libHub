
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

import { env } from './config/env.js';

import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';
import memberRoutes from './routes/members.js';
import loanRoutes from './routes/loans.js';
import reservationRoutes from './routes/reservations.js';
import fineRoutes from './routes/fines.js';
import reportRoutes from './routes/reports.js';
import healthRoutes from './routes/health.js';
import contactRoutes from './routes/contact.js';

import { notFound, errorHandler } from './middleware/errors.js';

const app = express();

// Allowed frontend origins
const allowedOrigins = [
  'https://lib-hub-gamma.vercel.app',
  'http://localhost:5173',
];

// CORS configuration — must be before API routes
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header (e.g. Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked this origin: ${origin}`)
      );
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Security and request middleware
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

if (env.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// API routes
app.use(
  '/api/auth',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }),
  authRoutes
);

app.use('/api/health', healthRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/fines', fineRoutes);
app.use('/api/reports', reportRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
