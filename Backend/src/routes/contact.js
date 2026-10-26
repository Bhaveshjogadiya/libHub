import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { getMySQLPool } from '../config/mysql.js';
import { protect, allowRoles } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
const validate = [
  body('name').trim().isLength({ min: 2, max: 100 }),
  body('email').trim().isEmail().isLength({ max: 190 }),
  body('subject').trim().isLength({ min: 3, max: 160 }),
  body('message').trim().isLength({ min: 10, max: 5000 })
];
router.post('/', validate, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: 'Please check the contact form fields.', errors: errors.array() });
  const db = getMySQLPool();
  if (!db) return res.status(503).json({ message: 'Contact service is not configured. Set MySQL variables and run the migration.' });
  const { name, email, subject, message } = req.body;
  const [result] = await db.execute(
    'INSERT INTO contact_messages (name, email, subject, message, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
    [name.trim(), email.trim().toLowerCase(), subject.trim(), message.trim(), 'new']
  );
  res.status(201).json({ message: 'Your message has been saved.', id: result.insertId });
}));
router.get('/', protect, allowRoles('admin'), asyncHandler(async (_req, res) => {
  const db = getMySQLPool();
  if (!db) return res.status(503).json({ message: 'Contact service is not configured.' });
  const [rows] = await db.execute('SELECT id, name, email, subject, message, status, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 200');
  res.json(rows);
}));
router.patch('/:id/status', protect, allowRoles('admin'), asyncHandler(async (req, res) => {
  const status = String(req.body.status || '');
  if (!['new', 'in_progress', 'resolved'].includes(status)) return res.status(400).json({ message: 'Invalid contact status.' });
  const db = getMySQLPool();
  if (!db) return res.status(503).json({ message: 'Contact service is not configured.' });
  const [result] = await db.execute('UPDATE contact_messages SET status = ? WHERE id = ?', [status, req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ message: 'Message not found.' });
  res.json({ message: 'Contact message status updated.' });
}));
export default router;
