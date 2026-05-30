import mongoose, { Schema } from 'mongoose';

export interface IWallet {
  _id: string;
  userId: mongoose.Types.ObjectId;
  name: string;
  currency: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  serverUpdatedAt: Date;
}

const WalletSchema = new Schema<IWallet>(
  {
    _id: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    currency: { type: String, required: true, default: 'LRD' },
    deleted: { type: Boolean, default: false },
    serverUpdatedAt: { type: Date, default: Date.now },
  },
  {
    _id: false,
    timestamps: true,
  }
);

WalletSchema.index({ userId: 1, updatedAt: -1 });
WalletSchema.index({ userId: 1, deleted: 1 });

export default mongoose.models.Wallet || mongoose.model<IWallet>('Wallet', WalletSchema);
