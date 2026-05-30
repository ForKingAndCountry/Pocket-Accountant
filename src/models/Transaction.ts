import mongoose, { Schema } from 'mongoose';

export interface ITransaction {
  _id: string; // Keep as string to match mobile sync IDs
  userId: mongoose.Types.ObjectId;
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  category: string;
  note: string;
  exchangeRate: number;
  accountId: string;
  deviceId: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  serverUpdatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    _id: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    category: { type: String, required: true },
    note: { type: String, default: '' },
    exchangeRate: { type: Number, default: 1.0 },
    accountId: { type: String, default: '' },
    deviceId: { type: String, default: '' },
    deleted: { type: Boolean, default: false, index: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    serverUpdatedAt: { type: Date, default: Date.now, index: true },
  },
  { _id: false, timestamps: false }
);

// Recommended MongoDB Indexes from page 18 of the update document:
// - userId + updatedAt
// - userId + createdAt
// - userId + deleted
TransactionSchema.index({ userId: 1, updatedAt: -1 });
TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ userId: 1, deleted: 1 });

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
