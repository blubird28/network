import {
  Validate,
  IsNotEmpty,
  IsString,
  NotEquals,
  ValidateIf,
  IsOptional,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';

import { FAKE_HANDLER, FAKE_KEY } from '@libs/nebula/testing/data/constants';

import Errors from '../../Error';
import { Fake, IntersectionFaker } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { UUIDv4Prop } from '../decorators/StringProp.decorator';
import { SerializedDataDto, ValidSerializedData } from '../serialized-data.dto';
import { SerializedData } from '../../Serialization/serializes';

import { CreateSubscriptionAttributeEnricherConfigDto } from './create-subscription-attribute-enricher-config.dto';

@ExternalType()
@DTOFaker()
@IntersectionFaker(CreateSubscriptionAttributeEnricherConfigDto)
export class UpdateSubscriptionAttributeEnricherConfigDto {
  @UUIDv4Prop()
  @IsOptional()
  readonly subscriptionProductMappingId?: string;

  @UUIDv4Prop()
  @IsOptional()
  readonly productSpecificationId?: string;

  @Expose()
  @ValidateIf((o, value) => value !== undefined)
  @IsString()
  @NotEquals(null)
  @IsNotEmpty()
  @Fake(FAKE_HANDLER)
  readonly handler?: string;

  @Expose()
  @ValidateIf((o, value) => value !== undefined)
  @IsString()
  @NotEquals(null)
  @IsNotEmpty()
  @Fake(FAKE_KEY)
  readonly key?: string;

  @Expose()
  @Type(() => SerializedDataDto)
  @Fake(['<%= order.attributes.destinationPortId %>'])
  @Validate(ValidSerializedData, { context: Errors.InvalidTemplate.context })
  paramTemplate: SerializedData;
}
