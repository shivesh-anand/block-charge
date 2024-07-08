import mongoose, { Document, Schema } from 'mongoose';

interface Charger {
  type: string;
  price: string;
}

interface QueueItem {
  email: string;
  vehicleType: string;
}

export interface IStation extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  location: string;
  chargers: Charger[];
  placeId: string; // Required place ID
  queue?: number; // Optional queue
  queueItems?: QueueItem[]; // Optional array of queue items
}

const chargerSchema = new Schema<Charger>({
  type: { type: String, required: true },
  price: { type: String, required: true },
});

const queueItemSchema = new Schema<QueueItem>({
  email: { type: String, required: true },
  vehicleType: { type: String, required: true },
});

const stationSchema = new Schema<IStation>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: String, required: true },
    chargers: { type: [chargerSchema], required: true },
    placeId: { type: String, required: true },
    queue: { type: Number },
    queueItems: { type: [queueItemSchema] },
  },
  {
    timestamps: true,
  }
);

const Station = mongoose.model<IStation>('Station', stationSchema);

export default Station;
