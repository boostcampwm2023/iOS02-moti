import {
  ErrorCode,
  MotimateException,
} from '../../common/exception/motimate.excpetion';

const errorCode: ErrorCode = {
  statusCode: 500,
  message: 'Apple ID 서버로의 public key 요청이 실패했습니다.',
};
export class FetchPublicKeyException extends MotimateException {
  constructor() {
    super(errorCode);
  }
}
