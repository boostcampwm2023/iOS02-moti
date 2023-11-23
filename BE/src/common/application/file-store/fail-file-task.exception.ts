import { MotimateException } from '../../exception/motimate.excpetion';
import { ERROR_INFO } from '../../exception/error-code';

export class FailFileTaskException extends MotimateException {
  constructor() {
    super(ERROR_INFO.FAIL_FILE_TASK);
  }
}
