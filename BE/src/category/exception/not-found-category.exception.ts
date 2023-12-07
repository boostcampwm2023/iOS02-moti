import { MotimateException } from '../../common/exception/motimate.excpetion';
import { ERROR_INFO } from '../../common/exception/error-code';

export class NotFoundCategoryException extends MotimateException {
  constructor() {
    super(ERROR_INFO.NOT_FOUND_CATEGORY);
  }
}
