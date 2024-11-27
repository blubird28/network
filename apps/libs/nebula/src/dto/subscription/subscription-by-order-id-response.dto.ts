import { Expose, Type } from 'class-transformer';
import { IsArray, IsISO8601, ValidateNested } from 'class-validator';

import Errors from '@libs/nebula/Error';
import { MAX_LENGTH_50 } from '@libs/nebula/subscription/subscription.constants';
import {
  FAKE_OBJECT_ID,
  FAKE_PRICE,
  FAKE_SUBSCRIPTION_REQUEST,
  FAKE_SUBSCRIPTION_RESPONSE,
} from '@libs/nebula/testing/data/constants';

import { DeepFakeMany } from '../../testing/data/fakers';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';
import StringProp from '../decorators/StringProp.decorator';

import { SubscriptionProductDetailsBaseDto } from './subscription-product-details-base.dto';

@ExternalType()
@DTOFaker()
export class SubscriptionByOrderIdResponseDto {
  @StringProp({
    allowEmpty: false,
    fake: FAKE_OBJECT_ID,
    maxLength: MAX_LENGTH_50,
    error: Errors.InvalidBillingAccountId,
  })
  readonly billingAccountId: string;

  @StringProp({
    fake: FAKE_SUBSCRIPTION_RESPONSE.subscriptionId,
    maxLength: MAX_LENGTH_50,
    optional: true,
  })
  readonly bpSubscriptionId?: string;

  @IsISO8601()
  @StringProp({
    allowEmpty: false,
    fake: FAKE_SUBSCRIPTION_REQUEST.contract_start_date,
  })
  readonly contractStartDate: string;

  @IsISO8601()
  @StringProp({
    fake: FAKE_SUBSCRIPTION_REQUEST.contract_end_date,
    optional: true,
  })
  readonly contractEndDate?: string;

  @Expose()
  @DeepFakeMany(() => SubscriptionProductDetailsBaseDto)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubscriptionProductDetailsBaseDto)
  readonly subscriptionProductDetails: SubscriptionProductDetailsBaseDto[];

  @StringProp({
    allowEmpty: false,
    fake: FAKE_PRICE,
  })
  get billingAmount(): string {
    if (this.subscriptionProductDetails) {
      const rates = this.subscriptionProductDetails.map((item) => item.rate);
      // We will only have 1 product under subscriptions.
      return rates[0];
    }
    return '0';
  }
}
