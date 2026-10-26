
import mongoose from 'mongoose';
const loanSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true, index: true },
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issuedAt: { type: Date, default: Date.now },
  dueAt: { type: Date, required: true },
  returnedAt: { type: Date },
  status: { type: String, enum: ['active', 'returned', 'overdue', 'lost', 'cancelled'], default: 'active', index: true },
  fineAmount: { type: Number, default: 0, min: 0 }
}, { timestamps: true });
export const Loan = mongoose.model('Loan', loanSchema);
