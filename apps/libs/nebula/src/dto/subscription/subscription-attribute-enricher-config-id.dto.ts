import { ExternalType } from '../../utils/external-type';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { UUIDv4Prop } from '../decorators/StringProp.decorator';

@ExternalType()
@DTOFaker()
export class SubscriptionAttributeEnricherConfigIdDto {
  /**
   * The ID (v4 UUID) of a subscription attribute enrichment config
   */
  @UUIDv4Prop()
  readonly id: string;
}
