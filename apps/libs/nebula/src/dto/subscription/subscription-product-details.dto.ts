import { Expose, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';

import { UUID_VERSION } from '@libs/nebula/utils/constants';
import Errors from '@libs/nebula/Error';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { FakeUuid, DeepFakeMany } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';

import { SubscriptionProductAttributeDetailsDto } from './subscription-product-attribute-details.dto';
import { SubscriptionProductDetailsBaseDto } from './subscription-product-details-base.dto';

@ExternalType()
@DTOFaker()
export class SubscriptionProductDetailsDto extends SubscriptionProductDetailsBaseDto {
  @FakeUuid
  @Expose()
  @IsUUID(UUID_VERSION, {
    context: Errors.InvalidSubscriptionProductDetailsId.context,
  })
  @IsNotEmpty({ context: Errors.InvalidSubscriptionProductDetailsId.context })
  @Type(() => String)
  readonly id: string;

  @DeepFakeMany(() => SubscriptionProductAttributeDetailsDto)
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubscriptionProductAttributeDetailsDto)
  subscriptionProductAttributeDetails: SubscriptionProductAttributeDetailsDto[];
}
