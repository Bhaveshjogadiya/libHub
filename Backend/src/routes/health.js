import { Router } from 'express';
import mongoose from 'mongoose';
import { checkMySQL } from '../config/mysql.js';
const router = Router();
router.get('/', async (req, res) => {
  let mysql;
  try { mysql = await checkMySQL(); }
  catch { mysql = { enabled: true, status: 'error' }; }
  const mongo = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const ok = mongo === 'connected' && (!mysql.enabled || mysql.status === 'connected');
  res.status(ok ? 200 : 503).json({ status: ok ? 'ok' : 'degraded', databases: { mongodb: mongo, mysql }, time: new Date().toISOString() });
});
export default router;
