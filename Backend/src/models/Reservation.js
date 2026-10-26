
import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['queued','ready','cancelled','fulfilled','expired'], default: 'queued' },
  queuePosition: { type: Number, default: 1 },
  expiresAt: Date
}, { timestamps: true });
schema.index({ book: 1, member: 1, status: 1 });
export const Reservation = mongoose.model('Reservation', schema);
