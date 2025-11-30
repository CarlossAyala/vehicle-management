import { NextFunction, Request, Response } from 'express';

export const AuthInitMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  req.auth = {
    userId: undefined,
    sessionId: undefined,
    tenantId: undefined,
    roles: [],
  };
  next();
};
