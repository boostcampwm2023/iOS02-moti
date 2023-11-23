import { MotimateException } from '../../common/exception/motimate.excpetion';
import { ERROR_INFO } from '../../common/exception/error-code';

export class UserNotAdminPendingStatusException extends MotimateException {
  constructor() {
    super(ERROR_INFO.USER_NOT_ADMIN_PENDING_STATUS);
  }
}
