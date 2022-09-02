import {Request, Response, NextFunction} from 'express';
import { ResponseError, CustomError } from '../errors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Error:', err.message);

  if (err instanceof CustomError) {
    const responseErr: ResponseError = err.serializeError();
    return res.status(err.statusCode).json(responseErr);
  }

  const responseError = new ResponseError();
  responseError.status = 500;
  responseError.errors[0] = {
    message: 'Something went wrong'
  };

  res.status(responseError.status).json(responseError);
};