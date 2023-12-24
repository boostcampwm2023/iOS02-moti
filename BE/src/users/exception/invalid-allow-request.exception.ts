import { ERROR_INFO } from '../../common/exception/error-code';
import { MotimateException } from '../../common/exception/motimate.excpetion';

export class InvalidAllowRequestException extends MotimateException {
  constructor() {
    super(ERROR_INFO.INVALID_ALLOW_REQUEST);
  }
}
