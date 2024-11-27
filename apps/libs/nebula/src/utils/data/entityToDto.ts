import { ClassConstructor, ClassTransformOptions } from 'class-transformer';

import toDto from './toDto';
import fromEntity from './fromEntity';

export type EntityToDtoOptions = {
  fromEntity?: Partial<ClassTransformOptions>;
  toDto?: Partial<ClassTransformOptions>;
};

function entityToDto<T, D>(
  entity: T[],
  dto: ClassConstructor<D>,
  options?: EntityToDtoOptions,
): D[];
function entityToDto<T, D>(
  entity: T,
  dto: ClassConstructor<D>,
  options?: EntityToDtoOptions,
): D;
function entityToDto<T, D>(
  entity: T | T[],
  dto: ClassConstructor<D>,
  options: EntityToDtoOptions = {},
): D | D[] {
  return toDto(fromEntity(entity, options.fromEntity), dto, options.toDto);
}

export default entityToDto;
