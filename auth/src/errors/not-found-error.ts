import { CustomError, ResponseError } from ".";

export class NotFoundError extends CustomError {
  public statusCode: number = 404;

  constructor() {
    super("404 Not Found: NotFoundError");
  }

  serializeError(): ResponseError {
    const responseError = new ResponseError();
    responseError.status = this.statusCode;
    responseError.errors[0] = {
      message: "404 Not Found"
    };

    return responseError;
  }

};