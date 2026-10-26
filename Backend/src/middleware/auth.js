
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

export async function protect(req, res, next) {
  try {
    const token = req.cookies?.libhub_token || req.headers.authorization?.replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ message: 'Please sign in to continue.' });
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub).select('-passwordHash');
    if (!user || user.status !== 'active') return res.status(401).json({ message: 'Account is unavailable.' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Session is invalid or expired.' });
  }
}
export const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ message: 'You do not have permission to do that.' });
  next();
};
