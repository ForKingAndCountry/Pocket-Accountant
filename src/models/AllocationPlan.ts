import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAllocationPlan extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  name: string;
  isDefault: boolean;
  percentSavings: number;
  percentDebt: number;
  percentInvestment: number;
  percentGuiltFree: number;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  serverUpdatedAt: Date;
}

const AllocationPlanSchema = new Schema<IAllocationPlan>(
  {
    _id: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, default: 'Default Plan' },
    isDefault: { type: Boolean, default: true },
    percentSavings: { type: Number, required: true, default: 10 },
    percentDebt: { type: Number, required: true, default: 20 },
    percentInvestment: { type: Number, required: true, default: 10 },
    percentGuiltFree: { type: Number, required: true, default: 60 },
    deleted: { type: Boolean, default: false },
    serverUpdatedAt: { type: Date, default: Date.now },
  },
  {
    _id: false,
    timestamps: true,
  }
);

AllocationPlanSchema.index({ userId: 1, updatedAt: -1 });

const AllocationPlan: Model<IAllocationPlan> =
  mongoose.models.AllocationPlan ||
  mongoose.model<IAllocationPlan>('AllocationPlan', AllocationPlanSchema);

export default AllocationPlan;
