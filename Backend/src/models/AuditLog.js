
import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  entityType: { type: String, default: '' },
  entityId: { type: String, default: '' },
  details: { type: mongoose.Schema.Types.Mixed, default: {} },
  ip: String
}, { timestamps: true });
export const AuditLog = mongoose.model('AuditLog', schema);
