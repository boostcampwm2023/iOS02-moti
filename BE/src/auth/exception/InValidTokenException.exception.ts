import {
  ErrorCode,
  MotimateException,
} from '../../common/exception/motimate.excpetion';

const errorCode: ErrorCode = {
  statusCode: 401,
  message: '잘못된 토큰입니다.',
};
export class InvalidTokenException extends MotimateException {
  constructor() {
    super(errorCode);
  }
}
