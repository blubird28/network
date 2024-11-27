import { Paginated, WithPaginatedDto } from '../paginated.dto';
import { ExternalType } from '../../utils/external-type';

import { PriceEnrichConfigDto } from './price-enrich-config.dto';

@ExternalType<WithPaginatedDto<PriceEnrichConfigDto>>()
export class PaginatedPriceEnrichConfigDto extends Paginated(
  PriceEnrichConfigDto,
) {}
