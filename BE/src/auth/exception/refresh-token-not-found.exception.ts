import { MotimateException } from '../../common/exception/motimate.excpetion';
import { ERROR_INFO } from '../../common/exception/error-code';

export class RefreshTokenNotFoundException extends MotimateException {
  constructor() {
    super(ERROR_INFO.REFRESH_TOKEN_NOT_FOUND);
  }
}
