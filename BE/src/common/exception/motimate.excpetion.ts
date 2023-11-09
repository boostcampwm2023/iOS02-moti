import { HttpException } from "@nestjs/common";

export interface ErrorCode {
  statusCode: number;
  message: string;
}

export class MotimateException extends HttpException{
  constructor(errorCode: ErrorCode) {
    super(errorCode.message, errorCode.statusCode);
  }
}
