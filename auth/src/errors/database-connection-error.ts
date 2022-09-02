import { ResponseError, CustomError } from '.';

const ERROR_MESSAGE = 'Error connecting to database';

export class DatabaseConnectionError extends CustomError {
  public statusCode: number = 500;
  public message: string = ERROR_MESSAGE;

  constructor() {
    super(ERROR_MESSAGE);

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
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