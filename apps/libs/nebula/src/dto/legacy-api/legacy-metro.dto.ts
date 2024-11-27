import StringProp, {
  MongoIDProp,
  UUIDv4Prop,
} from '../decorators/StringProp.decorator';
import { StringArrayProp } from '../decorators/ArrayProp.decorator';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ReferencedById } from '../../ReferenceBuilder/decorators';
import { ExternalType } from '../../utils/external-type';
import { FAKE_OBJECT_ID } from '../../testing/data/constants';

@ExternalType()
@ReferencedById()
@DTOFaker()
export class LegacyMetroDto {
  @MongoIDProp()
  public readonly id: string;

  @StringProp({ fake: 'Sydney', optional: true, allowEmpty: true })
  public readonly name: string;

  @StringProp({ fake: 'SYD' })
  public readonly code: string;

  @StringProp({ fake: 'au', optional: true, allowEmpty: true })
  public readonly country: string;

  @StringProp({ fake: 'ARIN', optional: true, allowEmpty: true })
  public readonly rir: string;

  @StringArrayProp({ fake: [FAKE_OBJECT_ID], optional: true })
  public readonly regionIds: string[];

  @UUIDv4Prop({ optional: true, allowEmpty: true })
  public readonly serviceLayerId: string;
}
