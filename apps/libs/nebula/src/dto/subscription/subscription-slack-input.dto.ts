import { Expose, Type } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';

import {
  FAKE_OBJECT_ID,
  FAKE_COMPANY_NAME,
  FAKE_ORDER_NAME,
  FAKE_PRODUCT_NAME,
  FAKE_SERVICE_ID,
} from '@libs/nebula/testing/data/constants';
import {
  MAX_LENGTH_10,
  MAX_LENGTH_50,
} from '@libs/nebula/subscription/subscription.constants';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { Fake } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';

@ExternalType()
@DTOFaker()
export class SubscriptionSlackInputDto {
  @Fake(FAKE_OBJECT_ID)
  @MaxLength(MAX_LENGTH_50)
  @Type(() => String)
  @IsString()
  @IsOptional()
  subscriptionId?: string;

  @Fake(FAKE_COMPANY_NAME)
  @Expose()
  @IsString()
  @MaxLength(MAX_LENGTH_50)
  @Type(() => String)
  companyName: string;

  @Fake(FAKE_OBJECT_ID)
  @Expose()
  @MaxLength(MAX_LENGTH_50)
  @IsString()
  @Type(() => String)
  companyId: string;

  @Fake(FAKE_SERVICE_ID)
  @Expose()
  @MaxLength(MAX_LENGTH_10)
  @IsString()
  @Type(() => String)
  serviceId: string;

  @Fake(FAKE_OBJECT_ID)
  @Expose()
  @MaxLength(MAX_LENGTH_50)
  @IsString()
  @Type(() => String)
  orderId: string;

  @Fake(FAKE_ORDER_NAME)
  @MaxLength(MAX_LENGTH_50)
  @Expose()
  @IsString()
  @Type(() => String)
  orderName: string;

  @Fake(FAKE_PRODUCT_NAME)
  @MaxLength(MAX_LENGTH_50)
  @Expose()
  @IsString()
  @Type(() => String)
  productName: string;

  @Fake(FAKE_OBJECT_ID)
  @MaxLength(MAX_LENGTH_50)
  @Expose()
  @Type(() => String)
  @IsString()
  @IsOptional()
  processInstanceId?: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  errorCode?: string;
}
