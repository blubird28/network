import { ExternalType } from '../../utils/external-type';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { UUIDv4Prop } from '../decorators/StringProp.decorator';

import { CreateSubscriptionAttributeEnricherConfigDto } from './create-subscription-attribute-enricher-config.dto';

@ExternalType()
@DTOFaker()
export class SubscriptionAttributeEnricherConfigDto extends CreateSubscriptionAttributeEnricherConfigDto {
  /**
   * The ID (v4 UUID) of this price enrichment config
   */
  @UUIDv4Prop()
  readonly id: string;
}
