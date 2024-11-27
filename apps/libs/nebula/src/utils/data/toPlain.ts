import { ClassTransformOptions } from 'class-transformer';

import { instanceToPlain } from '@libs/nebula/class-transformer';

const TO_PLAIN_DEFAULTS: Partial<ClassTransformOptions> = {
  excludeExtraneousValues: true,
  exposeDefaultValues: true,
  exposeUnsetFields: false,
};

function toPlain<T>(
  dto: T[],
  options?: Partial<ClassTransformOptions>,
): Record<string, unknown>[];
function toPlain<T>(
  dto: T,
  options?: Partial<ClassTransformOptions>,
): Record<string, unknown>;
function toPlain<T>(
  dto: T | T[],
  options: Partial<ClassTransformOptions> = {},
): Record<string, unknown> | Record<string, unknown>[] {
  return instanceToPlain(dto as T, {
    ...TO_PLAIN_DEFAULTS,
    ...options,
  });
}

export default toPlain;
