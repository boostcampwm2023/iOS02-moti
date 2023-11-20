import { MotimateException } from '../../common/exception/motimate.excpetion';
import { ERROR_INFO } from '../../common/exception/error-code';

export class AdminInvalidPasswordException extends MotimateException {
  constructor() {
    super(ERROR_INFO.ADMIN_INVALID_PASSWORD);
  }
}
