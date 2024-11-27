import { Expose, Type } from 'class-transformer'; // used for serialization ie to JSON ie outgoing
import { IsNotEmpty, IsOptional } from 'class-validator'; // used for deserialization ie from JSON ie incoming

import StringProp, {
  UUIDv4Prop,
} from '@libs/nebula/dto/decorators/StringProp.decorator';
import { ExternalType } from '@libs/nebula/utils/external-type';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import { Fake } from '@libs/nebula/testing/data/fakers';
import { FAKE_PRODUCT_SPEC_DELIVERY_TIME } from '@libs/nebula/testing/data/constants';

import NumberProp from '../decorators/NumberProp.decorator';
import ArrayProp from '../decorators/ArrayProp.decorator';

export enum DeliveryTimeUnitEnum {
  hour = 'h',
  day = 'd',
  week = 'w',
  month = 'm',
}
@ExternalType()
@DTOFaker()
export class DeliveryTimeDto {
  @NumberProp({ fake: 1 })
  duration: number;
  @StringProp({ fake: 'h' })
  unit: DeliveryTimeUnitEnum;
}

@ExternalType()
@DTOFaker()
export class LegacyMarketplaceProductSpecDto {
  @UUIDv4Prop()
  public readonly id: string;

  @NumberProp({ fake: 1 })
  public readonly version: number;

  @UUIDv4Prop({ optional: true })
  public readonly termsAndConditionsId?: string;

  @UUIDv4Prop()
  public readonly productOfferingId: string;

  @StringProp({ optional: true, fake: 'FakePriceKey' })
  public readonly priceKey?: string;

  @StringProp({ optional: true, fake: 'CREATE_ORDER' })
  public readonly actionType?: string;

  @Expose()
  @Type(() => DeliveryTimeDto)
  @IsNotEmpty()
  @IsOptional()
  @Fake(FAKE_PRODUCT_SPEC_DELIVERY_TIME)
  public readonly deliveryTime?: DeliveryTimeDto;

  @ArrayProp({ optional: true, fake: ['new'] })
  public readonly tags?: string[];
}
