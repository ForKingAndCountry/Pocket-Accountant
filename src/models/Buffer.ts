import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBuffer extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  name: string;
  purpose?: string;
  annualEstimate: number;
  currentBalance: number;
  currency: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  serverUpdatedAt: Date;
}

const BufferSchema = new Schema<IBuffer>(
  {
    _id: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    purpose: { type: String, default: '' },
    annualEstimate: { type: Number, required: true, default: 0 },
    currentBalance: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true, default: 'LRD' },
    deleted: { type: Boolean, default: false },
    serverUpdatedAt: { type: Date, default: Date.now },
  },
  {
    _id: false,
    timestamps: true,
  }
);

BufferSchema.index({ userId: 1, updatedAt: -1 });
BufferSchema.index({ userId: 1, deleted: 1 });

const Buffer: Model<IBuffer> =
  mongoose.models.Buffer || mongoose.model<IBuffer>('Buffer', BufferSchema);

export default Buffer;
