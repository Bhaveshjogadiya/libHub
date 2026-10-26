
import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { env } from './src/config/env.js';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(
  cors({
    origin: [
      'https://lib-hub-gamma.vercel.app',
      'http://localhost:5173',
    ],
    credentials: true,
  })
);

app.use(express.json());

// Register your existing API routes below this line.

export default app;
try {

  await connectDB();
  app.listen(env.port, () => console.log(`LibHub API listening on http://localhost:${env.port}`));
} catch (error) {
  console.error(`Unable to connect to MongoDB (${error.code || error.name}).`);
  console.error('Start MongoDB or set MONGODB_URI in Backend/.env to a reachable MongoDB database.');
  process.exitCode = 1;
}
