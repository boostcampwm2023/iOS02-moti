import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserGroupGrade } from '../../group/group/domain/user-group-grade';

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
          return (
            value !== undefined && typeof value === 'string' && value !== ''
          );
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

export const IsNotUserGroupGrade = (validationOptions?: ValidationOptions) => {
  return function (object: object, propertyKey: string) {
    registerDecorator({
      name: 'IsNotUserGroupGrade',
      target: object.constructor,
      propertyName: propertyKey,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          return Object.keys(UserGroupGrade).includes(value);
        },
      },
    });
  };
};

@ValidatorConstraint({ async: false })
export class IsSameValueAsConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value === relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${args.property} must match ${relatedPropertyName}`;
  }
}

export function IsSameValueAs(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isSameValueAs',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: IsSameValueAsConstraint,
    });
  };
}
