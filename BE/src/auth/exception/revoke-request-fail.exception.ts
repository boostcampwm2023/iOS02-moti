import { MotimateException } from '../../common/exception/motimate.excpetion';
import { ERROR_INFO } from '../../common/exception/error-code';

export class RevokeRequestFailException extends MotimateException {
  constructor() {
    super(ERROR_INFO.REVOKE_REQUEST_FAIL);
  }
}
