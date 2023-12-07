import { ERROR_INFO } from '../../../common/exception/error-code';
import { MotimateException } from '../../../common/exception/motimate.excpetion';

export class InvalidEmojiException extends MotimateException {
  constructor() {
    super(ERROR_INFO.INVALID_EMOJI);
  }
}
