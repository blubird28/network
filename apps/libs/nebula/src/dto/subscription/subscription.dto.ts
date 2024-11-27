import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { UUID_VERSION } from '@libs/nebula/utils/constants';
import Errors from '@libs/nebula/Error';
import {
  FAKE_SUBSCRIPTION_STATUS_SUCCESS,
  FAKE_SUBSCRIPTION_RESPONSE,
} from '@libs/nebula/testing/data/constants';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { Fake, FakeUuid, DeepFakeMany } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';

import { SubscriptionProductDetailsDto } from './subscription-product-details.dto';
import { SubscriptionBaseDto } from './subscription-base.dto';

@ExternalType()
@DTOFaker()
export class SubscriptionDto extends SubscriptionBaseDto {
  @FakeUuid
  @Expose()
  @IsUUID(UUID_VERSION, {
    context: Errors.InvalidSubscriptionId.context,
  })
  @IsNotEmpty({ context: Errors.InvalidSubscriptionId.context })
  @Type(() => String)
  readonly id: string;

  @Fake(FAKE_SUBSCRIPTION_STATUS_SUCCESS)
  @Expose()
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  readonly status: string;

  @Fake(FAKE_SUBSCRIPTION_RESPONSE.subscriptionId)
  @Expose()
  @IsString()
  @IsOptional()
  @Type(() => String)
  readonly bpSubscriptionId: string;

  @DeepFakeMany(() => SubscriptionProductDetailsDto)
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubscriptionProductDetailsDto)
  readonly subscriptionProductDetails: SubscriptionProductDetailsDto[];
}
