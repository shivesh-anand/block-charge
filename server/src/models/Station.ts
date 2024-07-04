import mongoose, { Document, Schema } from 'mongoose';

interface Charger {
  type: string;
  price: string;
}

export interface IStation extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  location: string;
  chargers: Charger[];
}

const chargerSchema = new Schema<Charger>({
  type: { type: String, required: true },
  price: { type: String, required: true },
});

const stationSchema = new Schema<IStation>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: String, required: true },
    chargers: { type: [chargerSchema], required: true },
  },
  {
    timestamps: true,
  }
);

const Station = mongoose.model<IStation>('Station', stationSchema);

export default Station;
