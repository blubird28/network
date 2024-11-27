import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import Errors from '@libs/nebula/Error';
import { FAKE_OBJECT_ID } from '@libs/nebula/testing/data/constants';
import { MAX_LENGTH_50 } from '@libs/nebula/subscription/subscription.constants';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { DeepFakeMany, Fake } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';

import { SubscriptionProductAttributeDetailsDto } from './subscription-product-attribute-details.dto';
import { SubscriptionProductDetailsBaseDto } from './subscription-product-details-base.dto';

@ExternalType()
@DTOFaker()
export class SubscriptionProductDetailsRequestDto extends SubscriptionProductDetailsBaseDto {
  @DeepFakeMany(() => SubscriptionProductAttributeDetailsDto)
  @Expose({ name: 'attributes' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubscriptionProductAttributeDetailsDto)
  subscriptionProductAttributeDetails: SubscriptionProductAttributeDetailsDto[];

  @Fake(FAKE_OBJECT_ID)
  @Expose({ name: 'accountId' })
  @MaxLength(MAX_LENGTH_50)
  @IsNotEmpty({ context: Errors.InvalidBillingAccountId.context })
  @Type(() => String)
  readonly billingAccountId: string;
}
