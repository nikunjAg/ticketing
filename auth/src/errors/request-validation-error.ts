import { ValidationError } from 'express-validator';
import { ResponseError, CustomError } from '.';

export class RequestValidationError extends CustomError {
  public statusCode: number = 400;

  constructor(public errors: ValidationError[]) {
    super("Error in validating request data: RequestValidationError");
  }

  serializeError(): ResponseError {
    const serializedError: ResponseError =  new ResponseError();

    serializedError.status = this.statusCode;
    serializedError.errors = this.errors.map(error => {
      return {
        message: error.msg,
        field: error.param,
      }
    });

    return serializedError;
  }
};