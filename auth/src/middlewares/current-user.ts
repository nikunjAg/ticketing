import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
};

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload
    }
  }
};

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const jwtToken = req.session?.jwt;

  if (!jwtToken) {
    return next();
  }

  try {
    const payload = jwt.verify(jwtToken, process.env.JWT_KEY!) as UserPayload;
    req.currentUser = payload;
  } catch (err) {}
  
  next();
}