import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  from: string;
  to: string;
  data: string;
  type: "SIGN_UP" | "VERIFICATION";
  timestamp: number;
  blockIndex: number;
}

const transactionSchema: Schema = new Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  data: { type: String, required: true },
  type: { type: String, required: true },
  timestamp: { type: Number, required: true },
  blockIndex: { type: Number, required: true },
});

export default mongoose.model<ITransaction>("Transaction", transactionSchema);
