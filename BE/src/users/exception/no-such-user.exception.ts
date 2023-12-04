import { ERROR_INFO } from '../../common/exception/error-code';
import { MotimateException } from '../../common/exception/motimate.excpetion';

export class NoSuchUserException extends MotimateException {
  constructor() {
    super(ERROR_INFO.NO_SUCH_USER);
  }
}
