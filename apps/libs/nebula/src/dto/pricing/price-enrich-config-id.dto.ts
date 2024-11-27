import { ExternalType } from '../../utils/external-type';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { UUIDv4Prop } from '../decorators/StringProp.decorator';

@ExternalType()
@DTOFaker()
export class PriceEnrichConfigIdDto {
  /**
   * The ID (v4 UUID) of a price enrichment config
   */
  @UUIDv4Prop()
  readonly configId: string;
}
