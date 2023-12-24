import { MotimateException } from '../../common/exception/motimate.excpetion';
import { ERROR_INFO } from '../../common/exception/error-code';

export class InvalidCategoryRelocateException extends MotimateException {
  constructor() {
    super(ERROR_INFO.INVALID_CATEGORY_RELOCATE);
  }
}
