import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';
import { UUIDv4Prop } from '../decorators/StringProp.decorator';

import { SubscriptionAttributeEnricherConfigBaseDto } from './subscription-attribute-enricher-config-base.dto';

@ExternalType()
@DTOFaker()
export class CreateSubscriptionAttributeEnricherConfigDto extends SubscriptionAttributeEnricherConfigBaseDto {
  /**
   * The id of the subscription product mapping to which this enricher applies. This enrichment will only run for orders matching that mapping.
   * @example 96711b0a-abfd-456b-b928-6e2ea29a87ac
   */
  @UUIDv4Prop()
  readonly subscriptionProductMappingId: string;

  @UUIDv4Prop()
  readonly productSpecificationId: string;
}
