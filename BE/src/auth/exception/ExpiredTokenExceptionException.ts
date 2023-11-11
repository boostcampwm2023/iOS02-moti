import {
  ErrorCode,
  MotimateException,
} from '../../common/exception/motimate.excpetion';

const errorCode: ErrorCode = {
  statusCode: 401,
  message: '만료된 토큰입니다.',
};
export class ExpiredTokenExceptionException extends MotimateException {
  constructor() {
    super(errorCode);
  }
}
