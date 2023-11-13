import { HttpException } from '@nestjs/common';
import { ErrorCode } from './error-code';

export class MotimateException extends HttpException {
  constructor(errorCode: ErrorCode) {
    super(errorCode.message, errorCode.statusCode);
  }
}
