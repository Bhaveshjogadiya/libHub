
import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  loan: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 0 },
  paidAmount: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: ['unpaid','partially_paid','paid','waived'], default: 'unpaid' },
  note: { type: String, default: '' }
}, { timestamps: true });
export const Fine = mongoose.model('Fine', schema);
