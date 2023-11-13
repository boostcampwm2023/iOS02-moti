import { MotimateException } from '../../common/exception/motimate.excpetion';
import { ERROR_INFO } from '../../common/exception/error-code';

export class PolicyNotFoundException extends MotimateException {
  constructor() {
    super(ERROR_INFO.POLICY_NOT_FOUND);
  }
}
