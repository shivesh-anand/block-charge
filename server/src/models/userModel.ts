import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  type: "user" | "station";
  vehicleType: string;
  vehicleNumber: string;
  stake: number;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    password: { type: String, required: true },
    vehicleType: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    stake: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
