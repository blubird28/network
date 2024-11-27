import { Expose, Transform, Type } from 'class-transformer'; // used for serialization ie to JSON
import { IsNotEmpty } from 'class-validator'; // used for deserialized ie from JSON

import { Fake } from '@libs/nebula/testing/data/fakers';
import {
  FAKE_ORDER_ATTRIBUTES,
  FAKE_UUID,
} from '@libs/nebula/testing/data/constants';
import { ExternalType } from '@libs/nebula/utils/external-type';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import fromMap from '@libs/nebula/utils/data/fromMap';
import StringProp, {
  MongoIDProp,
  UUIDv4Prop,
} from '@libs/nebula/dto/decorators/StringProp.decorator';
import DateProp from '@libs/nebula/dto/decorators/DateProp.decorator';

@ExternalType()
@DTOFaker()
export class OrderEventPayloadDto {
  @UUIDv4Prop({
    fake: FAKE_UUID,
  })
  id: string;

  @MongoIDProp()
  companyId: string;

  @UUIDv4Prop()
  productOfferingId: string;

  @UUIDv4Prop()
  productSpecificationId: string;

  @UUIDv4Prop({ optional: true })
  serviceId: string;

  @StringProp({ optional: true, fake: 'my order reference' })
  customerReference: string;

  @StringProp({ optional: true, fake: 'an order for compute resources' })
  name: string;

  @Expose()
  @Type(() => Map)
  @IsNotEmpty()
  @Fake(FAKE_ORDER_ATTRIBUTES)
  @Transform(fromMap, { toClassOnly: true })
  attributes: Map<string, string | number | boolean | Date>;

  @StringProp({ allowEmpty: false, fake: 'CREATED' })
  status: string;

  @DateProp()
  created_at: string;
}
