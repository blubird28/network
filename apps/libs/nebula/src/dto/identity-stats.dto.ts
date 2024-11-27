import { Expose, Type } from 'class-transformer';

import { DTOFaker } from '../testing/data/fakers/decorators/Faker';
import { Fake } from '../testing/data/fakers';
import { ReferencedBy } from '../ReferenceBuilder/decorators';
import { ExternalType } from '../utils/external-type';

@ExternalType()
@ReferencedBy<IdentityStatsDto>(
  ({ followers, following }) =>
    `followers: ${followers}; following: ${following}`,
)
@DTOFaker()
export class IdentityStatsDto {
  /**
   * Number of identities which follow this one
   * @example 1
   */
  @Fake(0)
  @Expose()
  @Type(() => Number)
  followers: number;

  /**
   * Number of identities which are followed by this one
   * @example 2
   */
  @Fake(0)
  @Expose()
  @Type(() => Number)
  following: number;
}
