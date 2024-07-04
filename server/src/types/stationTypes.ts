import { Document } from 'mongoose';

export interface IStation extends Document {
  name: string;
  email: string;
  password: string;
  location: string;
  chargerTypes: string[];
  prices: number[];
}
