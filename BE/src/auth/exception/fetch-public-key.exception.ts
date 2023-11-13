import { MotimateException } from '../../common/exception/motimate.excpetion';
import { ERROR_INFO } from '../../common/exception/error-code';

export class FetchPublicKeyException extends MotimateException {
  constructor() {
    super(ERROR_INFO.FETCH_PUBLIC_KEY);
  }
}
