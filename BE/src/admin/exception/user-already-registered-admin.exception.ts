import { MotimateException } from '../../common/exception/motimate.excpetion';
import { ERROR_INFO } from '../../common/exception/error-code';

export class UserAlreadyRegisteredAdminException extends MotimateException {
  constructor() {
    super(ERROR_INFO.USER_ALREADY_REGISTERED_ADMIN);
  }
}
