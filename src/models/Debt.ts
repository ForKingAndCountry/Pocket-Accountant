import mongoose, { Schema } from 'mongoose';

export interface IDebt {
  _id: string; // Map to mobile local UUID
  userId: mongoose.Types.ObjectId;
  person: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid';
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DebtSchema = new Schema<IDebt>(
  {
    _id: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    person: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    deleted: { type: Boolean, default: false, index: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { _id: false, timestamps: false }
);

// Recommended MongoDB Indexes:
// - userId + updatedAt
// - userId + status
DebtSchema.index({ userId: 1, updatedAt: -1 });
DebtSchema.index({ userId: 1, status: 1 });

export default mongoose.models.Debt || mongoose.model<IDebt>('Debt', DebtSchema);
