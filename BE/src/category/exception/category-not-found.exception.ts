import { MotimateException } from '../../common/exception/motimate.excpetion';
import { ERROR_INFO } from '../../common/exception/error-code';

export class CategoryNotFoundException extends MotimateException {
  constructor() {
    super(ERROR_INFO.CATEGORY_NOT_FOUND);
  }
}
