export interface ErrorCode {
  statusCode: number;
  message: string;
}

export class MotimateException extends Error {
  public readonly statusCode: number;
  constructor(errorCode: ErrorCode) {
    super(errorCode.message);
    this.statusCode = errorCode.statusCode;
  }
}
