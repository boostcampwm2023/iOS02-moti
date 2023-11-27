import { MotimateException } from '../../common/exception/motimate.excpetion';
import { ERROR_INFO } from '../../common/exception/error-code';

export class ImageAlreadyExistsThumbnailException extends MotimateException {
  constructor() {
    super(ERROR_INFO.IMAGE_ALREADY_EXISTS_THUMBNAIL);
  }
}
