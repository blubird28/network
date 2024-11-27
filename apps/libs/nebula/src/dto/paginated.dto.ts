import { Expose, Type as Typed } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';

import { instanceToPlain } from '@libs/nebula/class-transformer';

import { DTOFaker } from '../testing/data/fakers/decorators/Faker';
import { Fake, faker, IntersectionFaker } from '../testing/data/fakers';
import { ReferencedBy } from '../ReferenceBuilder/decorators';
import { ExternalType } from '../utils/external-type';

@ExternalType()
@DTOFaker()
export class PaginatedDto {
  /**
   * The number of records that were skipped before these results
   * @example 10
   */
  @Fake(0)
  @Typed(() => Number)
  @Expose()
  skip: number;

  /**
   * The number of results that are being returned
   * @example 16
   */
  @Fake(20)
  @Typed(() => Number)
  @Expose()
  count: number;

  /**
   * The total number of results that are available with the given query (except paging)
   * @example 100
   */
  @Fake(100)
  @Typed(() => Number)
  @Expose()
  total: number;
}

export interface WithPaginatedDto<T> extends PaginatedDto {
  results: T[];
}

export const Paginated = <A>(
  constructor: Type<A>,
): Type<WithPaginatedDto<A>> => {
  @ReferencedBy<InterimClass>(
    ({ results }, ref) => results.map(ref).join(', '),
    `Paginated${constructor.name}`,
  )
  @IntersectionFaker(PaginatedDto)
  class InterimClass extends PaginatedDto {
    @Expose()
    @Typed(() => constructor)
    @ApiProperty({ type: [constructor] })
    @Fake((res: any[]) =>
      (res ?? []).map((r) => instanceToPlain(faker(constructor, r))),
    )
    results: A[];
  }

  Object.defineProperty(InterimClass, 'name', {
    value: `Paginated${constructor.name}`,
  });
  return InterimClass;
};
