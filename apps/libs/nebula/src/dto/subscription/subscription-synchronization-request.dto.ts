import { Expose, Type, Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { isString } from 'lodash';

import Errors from '@libs/nebula/Error';
import { FAKE_OBJECT_ID, FAKE_UUID } from '@libs/nebula/testing/data/constants';
import { MAX_LENGTH_50 } from '@libs/nebula/subscription/subscription.constants';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { Fake } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';
import { StringArrayProp } from '../decorators/ArrayProp.decorator';
import { IsV4UUID } from '../../utils/decorators/isV4UUID.decorator';

@ExternalType()
@DTOFaker()
export class SubscriptionSyncRequestDto {
  @Fake(FAKE_OBJECT_ID)
  @Expose()
  @IsNotEmpty()
  @MaxLength(MAX_LENGTH_50)
  @Type(() => String)
  readonly orderId: string;

  @Fake(FAKE_OBJECT_ID)
  @Expose()
  @MaxLength(MAX_LENGTH_50)
  @IsNotEmpty({ context: Errors.InvalidProductOfferingId.context })
  @Type(() => String)
  @Transform(({ obj, key }) => (isString(obj[key]) ? obj[key] : undefined), {
    toClassOnly: true,
  })
  @IsString()
  readonly productOfferingId: string;

  @StringArrayProp(
    { fake: [FAKE_UUID], optional: true },
    IsV4UUID({ each: true }),
  )
  readonly ccProductSpecificationIds: string[];
}
