import { HttpException } from '@nestjs/common';

export interface ErrorCode {
  statusCode: number;
  message: string | object;
}

export const VERSION_NOT_FOUND = {
  statusCode: 500,
  message: '운영정책을 조회할 수 없습니다.',
};

export const VERSION_ALREADY_EXISTS = {
  statusCode: 500,
  message: '이미 초기화된 모티메이트 운영정책입니다.',
};

export class MotimateException extends HttpException {
  constructor(errorCode: ErrorCode) {
    super(errorCode.message, errorCode.statusCode);
  }
}
