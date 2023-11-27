import { MotimateException } from '../../common/exception/motimate.excpetion';
import { ERROR_INFO } from '../../common/exception/error-code';

export class ImageNotFoundException extends MotimateException {
  constructor() {
    super(ERROR_INFO.IMAGE_NOT_FOUND);
  }
}
