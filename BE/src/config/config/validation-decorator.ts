import { registerDecorator, ValidationOptions } from 'class-validator';

export const IsNotEmptyString = (validationOptions?: ValidationOptions) => {
  return function (object: object, propertyKey: string) {
    registerDecorator({
      name: 'isNonEmptyString',
      target: object.constructor,
      propertyName: propertyKey,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value !== undefined && typeof value === 'string';
        },
      },
    });
  };
};

export const IsNullOrString = (validationOptions?: ValidationOptions) => {
  return function (object: object, propertyKey: string) {
    registerDecorator({
      name: 'isNonEmptyString',
      target: object.constructor,
      propertyName: propertyKey,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value === undefined || typeof value === 'string';
        },
      },
    });
  };
};