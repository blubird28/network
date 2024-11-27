import { Expose, Transform, Type } from 'class-transformer'; // used for serialization ie to JSON
import { IsNotEmpty } from 'class-validator'; // used for deserialized ie from JSON

import { Fake } from '../../testing/data/fakers';
import { FAKE_ORDER_ATTRIBUTES, FAKE_UUID } from '../../testing/data/constants';
import { ExternalType } from '../../utils/external-type';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import fromMap from '../../utils/data/fromMap';
import StringProp, {
  MongoIDProp,
  UUIDv4Prop,
} from '../decorators/StringProp.decorator';
import { StringArrayProp } from '../decorators/ArrayProp.decorator';
import { IsV4UUID } from '../../utils/decorators/isV4UUID.decorator';
import DateProp from '../decorators/DateProp.decorator';

@ExternalType()
@DTOFaker()
export class ServiceEventPayloadDto {
  @UUIDv4Prop()
  id: string;

  @MongoIDProp()
  companyId: string;

  @UUIDv4Prop()
  productOfferingId: string;

  @StringArrayProp({ fake: [FAKE_UUID] })
  @IsV4UUID({ each: true })
  orderIds: string[];

  @StringProp({ optional: true, fake: 'compute resources' })
  name: string;

  @Expose()
  @Type(() => Map)
  @IsNotEmpty()
  @Fake(FAKE_ORDER_ATTRIBUTES)
  @Transform(fromMap, { toClassOnly: true })
  attributes: Map<string, string | number | boolean | Date>;

  @StringProp({ allowEmpty: false, fake: 'ACTIVE' })
  status: string;

  @DateProp()
  created_at: string;

  @DateProp()
  updated_at: string;
}
