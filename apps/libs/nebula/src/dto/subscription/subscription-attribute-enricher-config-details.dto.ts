import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';
import { UUIDv4Prop } from '../decorators/StringProp.decorator';
import DateProp from '../decorators/DateProp.decorator';

import { SubscriptionAttributeEnricherConfigBaseDto } from './subscription-attribute-enricher-config-base.dto';

@ExternalType()
@DTOFaker()
export class SubscriptionAttributeEnricherConfigDetailsDto extends SubscriptionAttributeEnricherConfigBaseDto {
  @UUIDv4Prop()
  readonly id: string;

  @UUIDv4Prop()
  readonly productSpecificationId: string;

  @UUIDv4Prop()
  readonly subscriptionProductMappingId: string;

  @DateProp()
  readonly createdAt: Date;

  @DateProp()
  readonly updatedAt: Date;
}
