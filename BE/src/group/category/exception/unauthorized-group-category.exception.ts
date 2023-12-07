import { MotimateException } from '../../../common/exception/motimate.excpetion';
import { ERROR_INFO } from '../../../common/exception/error-code';

export class UnauthorizedGroupCategoryException extends MotimateException {
  constructor() {
    super(ERROR_INFO.UNAUTHORIZED_GROUP_CATEGORY);
  }
}
