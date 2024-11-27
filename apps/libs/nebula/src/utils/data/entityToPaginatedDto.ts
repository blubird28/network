import { ClassConstructor, ClassTransformOptions } from 'class-transformer';

import {
  instanceToPlain,
  plainToInstance,
} from '@libs/nebula/class-transformer';

import { WithPaginatedDto } from '../../dto/paginated.dto';
import { PaginationDto } from '../../dto/pagination.dto';

export type EntityToDtoOptions = {
  fromEntity?: Partial<ClassTransformOptions>;
  toDto?: Partial<ClassTransformOptions>;
};

const FROM_ENTITY_DEFAULTS: Partial<ClassTransformOptions> = {
  excludeExtraneousValues: false,
  exposeDefaultValues: true,
};
const TO_DTO_DEFAULTS: Partial<ClassTransformOptions> = {
  excludeExtraneousValues: true,
  exposeDefaultValues: true,
};

const entityToPaginatedDto = <T, D>(
  { skip }: PaginationDto,
  entities: T[],
  total: number,
  dto: ClassConstructor<WithPaginatedDto<D>>,
  options: EntityToDtoOptions = {},
): WithPaginatedDto<D> => {
  const fromEntity = { ...FROM_ENTITY_DEFAULTS, ...(options.fromEntity || {}) };
  const toDto = { ...TO_DTO_DEFAULTS, ...(options.toDto || {}) };
  const plain = instanceToPlain(entities, fromEntity);

  return plainToInstance(
    dto,
    {
      results: plain,
      total,
      skip,
      count: plain.length,
    },
    toDto,
  );
};

export default entityToPaginatedDto;
