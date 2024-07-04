import mongoose, { Document, Schema } from 'mongoose';

interface CheckInDocument extends Document {
  vehicleType: string;
  vehicleNumber: string;
  location: string;
  userId: mongoose.Types.ObjectId;
  stationId: mongoose.Types.ObjectId;
  verified: boolean;
}

const CheckInSchema: Schema<CheckInDocument> = new Schema({
  vehicleType: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  location: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  stationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station',
    required: true,
  },
  verified: { type: Boolean, default: false },
});

export default mongoose.model<CheckInDocument>('CheckIn', CheckInSchema);
