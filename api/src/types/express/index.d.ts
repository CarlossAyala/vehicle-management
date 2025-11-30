import { Request } from 'express';
import { AuthData } from 'src/modules/auth/auth.interface';

declare global {
  namespace Express {
    interface Request {
      auth: AuthData;
    }
  }
}
