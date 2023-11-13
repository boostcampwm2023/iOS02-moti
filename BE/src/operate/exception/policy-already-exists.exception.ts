import { MotimateException } from '../../common/exception/motimate.excpetion';
import { ERROR_INFO } from '../../common/exception/error-code';

export class PolicyAlreadyExistsException extends MotimateException {
  constructor() {
    super(ERROR_INFO.POLICY_ALREADY_EXISTS);
  }
}
