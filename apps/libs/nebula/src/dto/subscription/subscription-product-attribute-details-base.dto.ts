import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

import {
  FAKE_ATTRIBUTE_NAME,
  FAKE_ATTRIBUTE_VALUE,
} from '@libs/nebula/testing/data/constants';
import { MAX_LENGTH_120 } from '@libs/nebula/subscription/subscription.constants';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { Fake } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';

@ExternalType()
@DTOFaker()
export class SubscriptionProductAttributeDetailsBaseDto {
  @Fake(FAKE_ATTRIBUTE_NAME)
  @Expose()
  @MaxLength(MAX_LENGTH_120)
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  readonly name: string;

  @Fake(FAKE_ATTRIBUTE_VALUE)
  @Expose()
  @MaxLength(MAX_LENGTH_120)
  @IsString()
  @IsOptional()
  @Type(() => String)
  value?: string;
}
