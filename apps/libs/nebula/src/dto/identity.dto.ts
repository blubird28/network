import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

import { DTOFaker } from '../testing/data/fakers/decorators/Faker';
import { JOE_BLOGGS_USERNAME } from '../testing/data/constants';
import { DeepFake, Fake, FakeObjectId, FakeUuid } from '../testing/data/fakers';
import { ReferencedBy } from '../ReferenceBuilder/decorators';
import { ExternalType } from '../utils/external-type';
import Errors from '../Error';

import { IdentityStatsDto } from './identity-stats.dto';

@ExternalType()
@ReferencedBy<IdentityDto>(({ mongoId }) => `mongoId: ${mongoId}`)
@DTOFaker()
export class IdentityDto {
  /**
   * The identity's username (used in some legacy URLs)
   * @example joe_bloggs
   */
  @Fake(JOE_BLOGGS_USERNAME)
  @Expose()
  @Type(() => String)
  username: string;

  /**
   * The identity's id (uuid4)
   * @example b92b19ee-25f1-4b1e-b4a7-94e295109a50
   */
  @FakeUuid
  @Expose()
  @Type(() => String)
  @IsUUID(4, { context: Errors.InvalidUserId.context })
  @IsNotEmpty({ context: Errors.InvalidUserId.context })
  id: string;

  /**
   * The identity's id (a mongo object ID, for legacy reasons)
   * @example 62a02730407271eeb4f86463
   */
  @FakeObjectId
  @Expose()
  @Type(() => String)
  mongoId: string;

  /**
   * Identities which follow this one
   * @example [{"username": "usr", "mongoId": "62a02730407271eeb4f86463", "followers": [], "following": [], "stats": {"followers": 0, "following": 0}}]
   */
  @Fake([])
  @Type(() => IdentityDto)
  @Expose()
  followers: IdentityDto[];

  /**
   * Identities which this one follows
   * @example [{"username": "usr", "mongoId": "62a02730407271eeb4f86463", "followers": [], "following": [], "stats": {"followers": 0, "following": 0}}]
   */
  @Fake([])
  @Type(() => IdentityDto)
  @Expose()
  following: IdentityDto[];

  /**
   * Numeric stats for this identity (eg how many follow or are followed by them)
   * @example {"followers": 1, "following": 2}
   */
  @DeepFake(() => IdentityStatsDto, { followers: 0, following: 0 })
  @Expose()
  @Type(() => IdentityStatsDto)
  stats: IdentityStatsDto;
}
