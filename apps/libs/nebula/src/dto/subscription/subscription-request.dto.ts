import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import {
  FAKE_OBJECT_ID,
  FAKE_SUBSCRIPTION_RESPONSE,
  FAKE_SUBSCRIPTION_STATUS_SUCCESS,
} from '@libs/nebula/testing/data/constants';
import { DeepFakeMany, Fake } from '@libs/nebula/testing/data/fakers';
import { MAX_LENGTH_50 } from '@libs/nebula/subscription/subscription.constants';
import Errors from '@libs/nebula/Error';

import { SubscriptionProductDetailsDto } from './subscription-product-details.dto';
import { SubscriptionBaseDto } from './subscription-base.dto';
import { SubscriptionProductDetailsRequestDto } from './subscription-product-details-request.dto';

export class SubscriptionRequestDto extends SubscriptionBaseDto {
  @Fake(FAKE_OBJECT_ID)
  @Expose({ name: 'accountId' })
  @MaxLength(MAX_LENGTH_50)
  @IsNotEmpty({ context: Errors.InvalidBillingAccountId.context })
  @Type(() => String)
  readonly billingAccountId: string;

  @DeepFakeMany(() => SubscriptionProductDetailsDto)
  @Expose({ name: 'accountProducts' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubscriptionProductDetailsRequestDto)
  readonly subscriptionProductDetails: SubscriptionProductDetailsRequestDto[];

  @Fake(FAKE_SUBSCRIPTION_RESPONSE.subscriptionId)
  @Expose({ name: 'subscriptionId' })
  @IsString()
  @IsOptional()
  @Type(() => String)
  readonly bpSubscriptionId: string;

  @Fake(FAKE_SUBSCRIPTION_STATUS_SUCCESS)
  @Expose({ name: 'message' })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  readonly status: string;
}
