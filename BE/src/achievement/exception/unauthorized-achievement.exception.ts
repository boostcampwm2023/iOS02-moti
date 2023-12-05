import { MotimateException } from '../../common/exception/motimate.excpetion';
import { ERROR_INFO } from '../../common/exception/error-code';

export class UnauthorizedAchievementException extends MotimateException {
  constructor() {
    super(ERROR_INFO.UNAUTHORIZED_ACHIEVEMENT_APPROACH);
  }
}
