import { MotimateException } from '../../../common/exception/motimate.excpetion';
import { ERROR_INFO } from '../../../common/exception/error-code';

export class InvalidGroupRelocateException extends MotimateException {
  constructor() {
    super(ERROR_INFO.INVALID_GROUP_RELOCATE);
  }
}
