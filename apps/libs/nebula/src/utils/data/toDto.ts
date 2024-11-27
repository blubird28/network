import { ClassConstructor, ClassTransformOptions } from 'class-transformer';

import { plainToInstance } from '@libs/nebula/class-transformer';

const TO_DTO_DEFAULTS: Partial<ClassTransformOptions> = {
  excludeExtraneousValues: true,
  exposeDefaultValues: true,
};

function toDto<T, D>(
  data: T[],
  dto: ClassConstructor<D>,
  options?: Partial<ClassTransformOptions>,
): D[];
function toDto<T, D>(
  data: T,
  dto: ClassConstructor<D>,
  options?: Partial<ClassTransformOptions>,
): D;
function toDto<T extends Record<string, unknown>, D>(
  data: T | T[],
  dto: ClassConstructor<D>,
  options: Partial<ClassTransformOptions> = {},
): D | D[] {
  return plainToInstance(dto, data as T, {
    ...TO_DTO_DEFAULTS,
    ...options,
  });
}

export default toDto;
