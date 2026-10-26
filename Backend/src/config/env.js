
import dotenv from 'dotenv';
dotenv.config();
const required = ['MONGODB_URI', 'JWT_SECRET'];
for (const key of required) {
  if (!process.env[key] && process.env.NODE_ENV === 'production') throw new Error(`Missing required environment variable: ${key}`);
}
export const env = {
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/libhub',
  jwtSecret: process.env.JWT_SECRET || 'development-only-change-this-secret-before-deploying',
  nodeEnv: process.env.NODE_ENV || 'development',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  mysql: {
    host: process.env.MYSQL_HOST || '',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || '',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'libhub_support',
    enabled: Boolean(process.env.MYSQL_HOST && process.env.MYSQL_USER && process.env.MYSQL_DATABASE)
  }
};
