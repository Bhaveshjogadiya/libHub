
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

export async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Please sign in to continue.'
      });
    }

    const token = authHeader.slice(7);

    const payload = jwt.verify(token, env.jwtSecret);

    const user = await User.findById(payload.sub);

    if (!user || user.status !== 'active') {
      return res.status(401).json({
        message: 'Account is unavailable.'
      });
    }

    req.user = user;

    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Session has expired. Please sign in again.'
      });
    }

    return res.status(401).json({
      message: 'Session is invalid. Please sign in again.'
    });
  }
}

export const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({
      message: 'You do not have permission to do that.'
    });
  }

  next();
};
