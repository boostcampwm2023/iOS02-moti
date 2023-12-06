import { MotimateException } from '../../../common/exception/motimate.excpetion';
import { ERROR_INFO } from '../../../common/exception/error-code';

export class UnauthorizedApproachGroupCategoryException extends MotimateException {
  constructor() {
    super(ERROR_INFO.UNAUTHORIZED_APPROACH_GROUP_CATEGORY);
  }
}
