import { MotimateException } from '../../../common/exception/motimate.excpetion';
import { ERROR_INFO } from '../../../common/exception/error-code';

export class InvitePermissionDeniedException extends MotimateException {
  constructor() {
    super(ERROR_INFO.INVITE_PERMISSION_DENIED);
  }
}
