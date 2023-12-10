import { MotimateException } from '../../../common/exception/motimate.excpetion';
import { ERROR_INFO } from '../../../common/exception/error-code';

export class NoSucGroupException extends MotimateException {
  constructor() {
    super(ERROR_INFO.NO_SUCH_GROUP);
  }
}
