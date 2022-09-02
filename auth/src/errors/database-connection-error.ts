import { ResponseError, CustomError } from '.';

export class DatabaseConnectionError extends CustomError {
  public statusCode: number = 400;
  public reason: string = 'Error connecting to database';

  constructor() {
    super("Error connecting to database: DatabaseConnectionError");
  }

  serializeError(): ResponseError {
    const serializedError: ResponseError =  new ResponseError();
    serializedError.status = 500;
    serializedError.errors[0] = {
      message: this.reason
    };

    return serializedError;
  }

};