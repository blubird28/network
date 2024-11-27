import { Paginated, WithPaginatedDto } from '../paginated.dto';
import { ExternalType } from '../../utils/external-type';

import { PriceDto } from './price.dto';

@ExternalType<WithPaginatedDto<PriceDto>>()
export class PaginatedPriceDto extends Paginated(PriceDto) {}
