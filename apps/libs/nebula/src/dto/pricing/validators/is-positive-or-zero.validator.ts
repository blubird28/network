import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isPositiveOrZero', async: false })
export class IsPositiveOrZero implements ValidatorConstraintInterface {
  validate(value: number): boolean | Promise<boolean> {
    return typeof value === 'number' && value >= 0;
  }

  defaultMessage(args?: ValidationArguments): string {
    return `${args.property} must be a positive number or zero`;
  }
}
