import { MotimateException } from '../../../common/exception/motimate.excpetion';
import { ERROR_INFO } from '../../../common/exception/error-code';

export class OnlyLeaderAllowedAssignGradeException extends MotimateException {
  constructor() {
    super(ERROR_INFO.ONLY_LEADER_ALLOWED_ASSIGN_GRADE);
  }
}
