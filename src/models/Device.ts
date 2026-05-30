import mongoose, { Schema } from 'mongoose';

export interface IDevice {
  userId: mongoose.Types.ObjectId;
  deviceId: string;
  lastSeenAt: Date;
  lastSyncAt: Date;
  appVersion: string;
}

const DeviceSchema = new Schema<IDevice>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    deviceId: { type: String, required: true, unique: true, index: true },
    lastSeenAt: { type: Date, default: Date.now },
    lastSyncAt: { type: Date, default: Date.now },
    appVersion: { type: String, default: '1.0.0' },
  },
  { timestamps: false }
);

export default mongoose.models.Device || mongoose.model<IDevice>('Device', DeviceSchema);
