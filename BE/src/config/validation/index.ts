import { ValidationError, ValidationPipeOptions } from '@nestjs/common';
import { MotimateException } from '../../common/exception/motimate.excpetion';

export const validationPipeOptions: ValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  exceptionFactory: (errors: ValidationError[]) => {
    const validated = errors.reduce((prev, error: ValidationError) => {
      prev[error.property] = Object.values(error.constraints || {});
      return prev;
    }, {});

    return new MotimateException({ statusCode: 400, message: validated });
  },
};
