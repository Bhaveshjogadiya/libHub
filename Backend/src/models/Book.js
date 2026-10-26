
import mongoose from 'mongoose';
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 180 },
  isbn: { type: String, trim: true, sparse: true, unique: true },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  authors: [{ type: String, trim: true }],
  category: { type: String, default: 'General', index: true },
  publisher: { type: String, default: '' },
  publicationYear: { type: Number, min: 1000, max: 2200 },
  language: { type: String, default: 'English' },
  edition: { type: String, default: '1st' },
  shelf: { type: String, default: 'A-01' },
  coverImage: { type: String, default: '/images/cover-1.svg' },
  totalCopies: { type: Number, required: true, min: 1, default: 1 },
  availableCopies: { type: Number, required: true, min: 0, default: 1 },
  borrowingEligible: { type: Boolean, default: true }
}, { timestamps: true });
bookSchema.index({ title: 'text', authors: 'text', isbn: 'text', publisher: 'text' });
export const Book = mongoose.model('Book', bookSchema);
