import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

import Errors from '@libs/nebula/Error';
import { UUID_VERSION } from '@libs/nebula/utils/constants';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { FakeUuid } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';

import { SubscriptionProductAttributeDetailsBaseDto } from './subscription-product-attribute-details-base.dto';

@ExternalType()
@DTOFaker()
export class SubscriptionProductAttributeDetailsDto extends SubscriptionProductAttributeDetailsBaseDto {
  @FakeUuid
  @Expose()
  @IsUUID(UUID_VERSION, {
    context: Errors.InvalidSubscriptionProductAttributeDetailsId.context,
  })
  @IsNotEmpty({
    context: Errors.InvalidSubscriptionProductAttributeDetailsId.context,
  })
  @Type(() => String)
  readonly id: string;
}
