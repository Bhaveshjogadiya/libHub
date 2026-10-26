
import mongoose from 'mongoose';
const schema = new mongoose.Schema({ name: { type: String, required: true, unique: true, trim: true }, description: { type: String, default: '' } }, { timestamps: true });
export const Category = mongoose.model('Category', schema);
