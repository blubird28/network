import { Paginated, WithPaginatedDto } from '../paginated.dto';
import { ExternalType } from '../../utils/external-type';

import { ViewBillingAccountDetails } from './billing-account-view.dto';

@ExternalType<WithPaginatedDto<ViewBillingAccountDetails>>()
export class PaginatedListBillingAccountResponseDto extends Paginated(
  ViewBillingAccountDetails,
) {}
