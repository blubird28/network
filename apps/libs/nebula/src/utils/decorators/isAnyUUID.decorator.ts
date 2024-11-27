import { IsUUID, ValidationOptions } from 'class-validator';

export const IsAnyUUID = (validationOptions?: ValidationOptions) =>
  IsUUID('all', validationOptions);
