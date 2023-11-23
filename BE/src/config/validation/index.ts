import { ValidationError, ValidationPipeOptions } from '@nestjs/common';
import { MotimateException } from '../../common/exception/motimate.excpetion';

export interface ValidationErrorMessage {
  [key: string]: string[] | string;
}

export const validationPipeOptions: ValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
  exceptionFactory: (errors: ValidationError[]) => {
    const defaultErrorMessage: ValidationErrorMessage = {
      error: '잘못된 입력입니다.',
    };

    const validated: ValidationErrorMessage =
      errors?.reduce((prev: ValidationErrorMessage, error: ValidationError) => {
        prev[error.property] = Object.values(error.constraints || {});
        return prev;
      }, {}) || defaultErrorMessage;

    for (const key in validated) {
      if (validated[key].length <= 1) {
        validated[key] = validated[key][0];
      }
    }

    return new MotimateException({ statusCode: 400, message: validated });
  },
};
