
import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  membershipNumber: { type: String, unique: true, sparse: true },
  role: { type: String, enum: ['admin', 'librarian', 'member'], default: 'member' },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  avatar: { type: String, default: '/images/avatar-member.svg' },
  membershipExpiry: { type: Date }
}, { timestamps: true });
userSchema.index({ name: 'text', email: 'text', membershipNumber: 'text' });
export const User = mongoose.model('User', userSchema);
