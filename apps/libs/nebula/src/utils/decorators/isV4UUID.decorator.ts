import { IsUUID, ValidationOptions } from 'class-validator';

import { UUID_VERSION } from '../constants';

export const IsV4UUID = (validationOptions?: ValidationOptions) =>
  IsUUID(UUID_VERSION, validationOptions);
