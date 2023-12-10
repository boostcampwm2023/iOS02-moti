import { MotimateException } from '../../../common/exception/motimate.excpetion';
import { ERROR_INFO } from '../../../common/exception/error-code';

export class DuplicatedJoinException extends MotimateException {
  constructor() {
    super(ERROR_INFO.DUPLICATED_JOIN);
  }
}
