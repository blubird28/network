import { Paginated, WithPaginatedDto } from '../paginated.dto';
import { ExternalType } from '../../utils/external-type';

import { SubscriptionAttributeEnricherConfigDto } from './subscription-attribute-enricher-config.dto';

@ExternalType<WithPaginatedDto<SubscriptionAttributeEnricherConfigDto>>()
export class PaginatedSubscriptionAttributeEnricherConfigDto extends Paginated(
  SubscriptionAttributeEnricherConfigDto,
) {}
