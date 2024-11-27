import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';
import { UUIDv4Prop } from '../decorators/StringProp.decorator';

@ExternalType()
@DTOFaker()
export class ProductSpecificationIdDto {
  @UUIDv4Prop()
  readonly productSpecificationId: string;
}
