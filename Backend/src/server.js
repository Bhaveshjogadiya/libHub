
import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

try {
  await connectDB();
  app.listen(env.port, () => console.log(`LibHub API listening on http://localhost:${env.port}`));
} catch (error) {
  console.error(`Unable to connect to MongoDB (${error.code || error.name}).`);
  console.error('Start MongoDB or set MONGODB_URI in Backend/.env to a reachable MongoDB database.');
  process.exitCode = 1;
}
