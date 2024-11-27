import { ClassTransformOptions } from 'class-transformer';

import { instanceToPlain } from '@libs/nebula/class-transformer';

const FROM_ENTITY_DEFAULTS: Partial<ClassTransformOptions> = {
  excludeExtraneousValues: false,
  exposeDefaultValues: true,
};

function fromEntity<T>(
  entity: T[],
  options?: Partial<ClassTransformOptions>,
): Record<string, unknown>[];
function fromEntity<T>(
  entity: T,
  options?: Partial<ClassTransformOptions>,
): Record<string, unknown>;
function fromEntity<T>(
  entity: T | T[],
  options: Partial<ClassTransformOptions> = {},
): Record<string, unknown> | Record<string, unknown>[] {
  return instanceToPlain(entity, {
    ...FROM_ENTITY_DEFAULTS,
    ...options,
  });
}

export default fromEntity;
