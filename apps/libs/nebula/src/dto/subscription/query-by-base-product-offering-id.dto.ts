import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';
import { UUIDv4Prop } from '../decorators/StringProp.decorator';

@ExternalType()
@DTOFaker()
export class QueryByBaseProductOfferingIdDto {
  @UUIDv4Prop()
  readonly ccBaseProductOfferingId: string;
}
