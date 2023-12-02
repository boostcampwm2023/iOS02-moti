import { MotimateException } from '../../../common/exception/motimate.excpetion';
import { ERROR_INFO } from '../../../common/exception/error-code';

export class LeaderNotAllowedToLeaveException extends MotimateException {
  constructor() {
    super(ERROR_INFO.LEADER_NOT_ALLOWED_TO_LEAVE);
  }
}
