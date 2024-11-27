import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Expose, Type } from 'class-transformer';

import { DTOFaker } from '../testing/data/fakers/decorators/Faker';
import { Fake } from '../testing/data/fakers';
import { ReferencedBy } from '../ReferenceBuilder/decorators';
import { ExternalType } from '../utils/external-type';
import Errors from '../Error';

export const MINIMUM_SKIP = 0;
export const MINIMUM_COUNT = 1;
export const MAXIMUM_COUNT = 100;
export const DEFAULT_SKIP = 0;
export const DEFAULT_COUNT = 20;

@ExternalType()
@ReferencedBy<PaginationDto>(
  ({ skip, count }) => `skip: ${skip}; count: ${count}`,
)
@DTOFaker()
export class PaginationDto {
  /**
   * The number of records to skip in the query
   * @example 40
   */
  @Fake(DEFAULT_SKIP)
  @Expose()
  @Type(() => Number)
  @IsOptional({ context: Errors.InvalidPagination.context })
  @IsInt({ context: Errors.InvalidPagination.context })
  @Min(MINIMUM_SKIP, { context: Errors.InvalidPagination.context })
  readonly skip: number = DEFAULT_SKIP;

  /**
   * The number of records to return from the query (eg the page size)
   * @example 20
   */
  @Fake(DEFAULT_COUNT)
  @Expose()
  @Type(() => Number)
  @IsOptional({ context: Errors.InvalidPagination.context })
  @IsInt({ context: Errors.InvalidPagination.context })
  @Min(MINIMUM_COUNT, { context: Errors.InvalidPagination.context })
  @Max(MAXIMUM_COUNT, { context: Errors.InvalidPagination.context })
  readonly count: number = DEFAULT_COUNT;

  constructor(count: number = DEFAULT_COUNT, skip: number = DEFAULT_SKIP) {
    this.count = count;
    this.skip = skip;
  }
}
