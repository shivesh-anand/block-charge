import { IUser } from '../models/User';
import { IStation } from '../models/Station';

declare global {
  namespace Express {
    interface Request {
      user?: IUser | IStation;
    }
  }
}
