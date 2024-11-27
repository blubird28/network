import { ClassTransformOptions } from 'class-transformer';

export const DEFAULT_DESERIALIZATION_OPTIONS: ClassTransformOptions = {
  exposeDefaultValues: true,
  excludeExtraneousValues: true,
};
