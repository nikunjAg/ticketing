import { ResponseError, CustomError } from '.';

const ERROR_MESSAGE = 'Not authorized';

export class NotAuthorizedError extends CustomError {
  public statusCode: number = 401;
  public message: string = ERROR_MESSAGE;

  constructor() {
    super(ERROR_MESSAGE);
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
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