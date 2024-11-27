import { Expose, Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

import {
  FAKE_SUBSCRIPTION_PRODUCT_DETAILS_RESPONSE,
  FAKE_SUBSCRIPTION_PRODUCT_CHARGES,
  FAKE_SUBSCRIPTION_PRODUCT,
} from '@libs/nebula/testing/data/constants';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { DeepFakeMany, Fake } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';

@ExternalType()
@DTOFaker()
export class SubscriptionProduct {
  @Fake(FAKE_SUBSCRIPTION_PRODUCT.productOfferingId)
  @Expose()
  @Type(() => String)
  readonly productOfferingId: string;

  @Fake(FAKE_SUBSCRIPTION_PRODUCT.rate)
  @Expose()
  @Type(() => Number)
  readonly rate: number;

  @Fake(FAKE_SUBSCRIPTION_PRODUCT.productOfferingName)
  @Expose()
  @Type(() => String)
  readonly productOfferingName: string;
}

@ExternalType()
@DTOFaker()
export class SubscriptionProductCharges {
  @Fake(FAKE_SUBSCRIPTION_PRODUCT_CHARGES.ratingMethod)
  @Expose()
  @Type(() => String)
  readonly ratingMethod: string;

  @Fake(FAKE_SUBSCRIPTION_PRODUCT_CHARGES.totalAmount)
  @Expose()
  @Type(() => Number)
  readonly totalAmount: number;

  @DeepFakeMany(() => SubscriptionProduct)
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubscriptionProduct)
  readonly products: SubscriptionProduct[];
}

@ExternalType()
@DTOFaker()
export class ViewSubscriptionResponseDto {
  @Fake(FAKE_SUBSCRIPTION_PRODUCT_DETAILS_RESPONSE.bpSubscriptionId)
  @Expose()
  @Type(() => String)
  readonly bpSubscriptionId: string;

  @Fake(FAKE_SUBSCRIPTION_PRODUCT_DETAILS_RESPONSE.billingAccountId)
  @Expose()
  @Type(() => String)
  readonly billingAccountId: string;

  @Fake(FAKE_SUBSCRIPTION_PRODUCT_DETAILS_RESPONSE.productOfferingId)
  @Expose()
  @Type(() => String)
  readonly productOfferingId: string;

  @Fake(FAKE_SUBSCRIPTION_PRODUCT_DETAILS_RESPONSE.isActive)
  @Expose()
  @Type(() => Boolean)
  readonly isActive: boolean;

  @Fake(FAKE_SUBSCRIPTION_PRODUCT_DETAILS_RESPONSE.contractStartDate)
  @Expose()
  @Type(() => String)
  readonly contractStartDate: string;

  @Fake(FAKE_SUBSCRIPTION_PRODUCT_DETAILS_RESPONSE.contractEndDate)
  @Expose()
  @Type(() => String)
  readonly contractEndDate: string;

  @Fake(FAKE_SUBSCRIPTION_PRODUCT_DETAILS_RESPONSE.serviceId)
  @Expose()
  @Type(() => String)
  readonly serviceId: string;

  @Fake(FAKE_SUBSCRIPTION_PRODUCT_DETAILS_RESPONSE.orderId)
  @Expose()
  @Type(() => String)
  readonly orderId: string;

  @DeepFakeMany(() => SubscriptionProductCharges)
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubscriptionProductCharges)
  readonly charges: SubscriptionProductCharges[];
}
