import mysql from 'mysql2/promise';
import { env } from './env.js';

let pool;
export function getMySQLPool() {
  if (!env.mysql.enabled) return null;
  if (!pool) pool = mysql.createPool({
    host: env.mysql.host, port: env.mysql.port, user: env.mysql.user,
    password: env.mysql.password, database: env.mysql.database,
    waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    enableKeepAlive: true
  });
  return pool;
}
export async function checkMySQL() {
  const db = getMySQLPool();
  if (!db) return { enabled: false, status: 'not_configured' };
  const connection = await db.getConnection();
  try { await connection.ping(); return { enabled: true, status: 'connected' }; }
  finally { connection.release(); }
}
