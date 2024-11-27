import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, MaxLength, IsEnum } from 'class-validator';

import Errors from '@libs/nebula/Error';
import { FAKE_OBJECT_ID } from '@libs/nebula/testing/data/constants';
import { MAX_LENGTH_8 } from '@libs/nebula/subscription/subscription.constants';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { Fake, FakeUuid } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';

export enum Actions {
  HISTORY = 'history',
  ACTIVE = 'active',
}

@ExternalType()
@DTOFaker()
export class GetSubscriptionDto {
  @FakeUuid
  @Expose()
  @IsOptional()
  @Type(() => String)
  @MaxLength(MAX_LENGTH_8, { context: Errors.InvalidSubscriptionId.context })
  @IsNotEmpty({ context: Errors.InvalidSubscriptionId.context })
  readonly subscriptionId?: string;

  @Fake(FAKE_OBJECT_ID)
  @Expose()
  @IsOptional()
  @IsNotEmpty({ context: Errors.InvalidServiceId.context })
  @Type(() => String)
  readonly serviceId?: string;

  @Fake(Actions.ACTIVE)
  @Expose()
  @IsOptional()
  @IsNotEmpty({ context: Errors.InvalidSubscriptionAction.context })
  @IsEnum(Actions, { context: Errors.InvalidSubscriptionAction.context })
  @Type(() => String)
  action?: Actions = Actions.ACTIVE;
}
