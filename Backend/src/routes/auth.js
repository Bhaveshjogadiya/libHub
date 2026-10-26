
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const router = Router();
const validate = (req, res, next) => { const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ message: 'Please check the submitted fields.', errors: errors.array() }); next(); };
function issueCookie(user, res) {
  const token = jwt.sign({ sub: user._id, role: user.role }, env.jwtSecret, { expiresIn: '8h' });
  res.cookie('libhub_token', token, { httpOnly: true, secure: env.nodeEnv === 'production', sameSite: 'lax', maxAge: 8 * 60 * 60 * 1000 });
}
router.post('/register', [body('name').trim().isLength({min:2,max:100}), body('email').isEmail().normalizeEmail(), body('password').isLength({min:8})], validate, asyncHandler(async (req,res) => {
  const { name, email, password } = req.body;
  if (await User.exists({ email })) return res.status(409).json({ message: 'An account with this email already exists.' });
  const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12), membershipNumber: `LH-${Date.now().toString().slice(-8)}`, role: 'member' });
  issueCookie(user, res);
  res.status(201).json({ user: { id:user._id, name:user.name, email:user.email, role:user.role, avatar:user.avatar } });
}));
router.post('/login', [body('email').isEmail().normalizeEmail(), body('password').notEmpty()], validate, asyncHandler(async (req,res) => {
  const user = await User.findOne({ email: req.body.email }).select('+passwordHash');
  if (!user || !(await bcrypt.compare(req.body.password, user.passwordHash))) return res.status(401).json({ message: 'Email or password is incorrect.' });
  if (user.status !== 'active') return res.status(403).json({ message: 'This account is suspended. Contact the library.' });
  issueCookie(user, res);
  res.json({ user: { id:user._id, name:user.name, email:user.email, role:user.role, avatar:user.avatar } });
}));
router.post('/logout', (req,res) => { res.clearCookie('libhub_token', { httpOnly:true, sameSite:'lax', secure:env.nodeEnv === 'production' }); res.json({ message:'Signed out.' }); });
router.get('/me', protect, (req,res) => res.json({ user: { id:req.user._id, name:req.user.name, email:req.user.email, role:req.user.role, avatar:req.user.avatar, membershipNumber:req.user.membershipNumber } }));
export default router;
