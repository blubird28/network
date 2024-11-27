import { Paginated, WithPaginatedDto } from '../paginated.dto';
import { ExternalType } from '../../utils/external-type';

import { PriceRequestDto } from './price-request.dto';

@ExternalType<WithPaginatedDto<PriceRequestDto>>()
export class PaginatedPriceRequestDto extends Paginated(PriceRequestDto) {}
