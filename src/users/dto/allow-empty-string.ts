import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function AllowEmptyString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'allowEmptyString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value === '' || value === null || value === undefined || typeof value === 'string';
        },
      },
    });
  };
}