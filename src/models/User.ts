import mongoose, { Schema } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  baseCurrency: string;
  subscriptionStatus: 'trial' | 'active' | 'expired' | 'grace';
  subscriptionEndsAt: Date;
  /** bcrypt hash of the 6-digit password reset code */
  passwordResetCodeHash?: string | null;
  passwordResetExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    baseCurrency: { type: String, default: 'LRD' },
    subscriptionStatus: {
      type: String,
      enum: ['trial', 'active', 'expired', 'grace'],
      default: 'trial',
    },
    subscriptionEndsAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    passwordResetCodeHash: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
