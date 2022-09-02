interface ErrorEntry {
  message: string;
  field?: string;
};

export class ResponseError extends Error {
  public status: number = 500;
  public errors: ErrorEntry[] = [];

  constructor() {
    super();

    // Because we are extending a built in class 
    Object.setPrototypeOf(this, ResponseError.prototype);
  }
};