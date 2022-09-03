import { ResponseError, CustomError } from '.';

export class BadRequestError extends CustomError {
  public statusCode: number = 400;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeError(): ResponseError {
    const serializedError: ResponseError =  new ResponseError();
    serializedError.status = this.statusCode;
    serializedError.errors[0] = {
      message: this.message
    };

    return serializedError;
  }

};