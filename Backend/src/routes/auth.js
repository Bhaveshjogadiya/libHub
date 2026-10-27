
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Please check the submitted fields.',
      errors: errors.array()
    });
  }

  next();
};

function createToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role
    },
    env.jwtSecret,
    { expiresIn: '8h' }
  );
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    membershipNumber: user.membershipNumber
  };
}

// Register
router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2, max: 100 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 })
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (await User.exists({ email })) {
      return res.status(409).json({
        message: 'An account with this email already exists.'
      });
    }

    const user = await User.create({
      name,
      email,
      passwordHash: await bcrypt.hash(password, 12),
      membershipNumber: `LH-${Date.now().toString().slice(-8)}`,
      role: 'member'
    });

    const token = createToken(user);

    return res.status(201).json({
      token,
      user: publicUser(user)
    });
  })
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  validate,
  asyncHandler(async (req, res) => {
    const user = await User.findOne({
      email: req.body.email
    }).select('+passwordHash');

    if (
      !user ||
      !(await bcrypt.compare(req.body.password, user.passwordHash))
    ) {
      return res.status(401).json({
        message: 'Email or password is incorrect.'
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        message: 'This account is suspended. Contact the library.'
      });
    }

    const token = createToken(user);

    return res.json({
      token,
      user: publicUser(user)
    });
  })
);

// Logout
router.post('/logout', (req, res) => {
  res.json({
    message: 'Signed out.'
  });
});

// Current user
router.get('/me', protect, (req, res) => {
  res.json({
    user: publicUser(req.user)
  });
});

export default router;
