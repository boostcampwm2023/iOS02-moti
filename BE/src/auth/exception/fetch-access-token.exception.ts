import { MotimateException } from '../../common/exception/motimate.excpetion';
import { ERROR_INFO } from '../../common/exception/error-code';

export class FetchAccessTokenException extends MotimateException {
  constructor() {
    super(ERROR_INFO.FETCH_ACCESS_TOKEN);
  }
}
