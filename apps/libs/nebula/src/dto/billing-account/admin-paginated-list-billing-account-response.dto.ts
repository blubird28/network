import { Paginated, WithPaginatedDto } from '../paginated.dto';
import { ExternalType } from '../../utils/external-type';

import { AdminViewBillingAccountDetails } from './admin-billing-account-view.dto';

@ExternalType<WithPaginatedDto<AdminViewBillingAccountDetails>>()
export class AdminPaginatedListBillingAccountResponseDto extends Paginated(
  AdminViewBillingAccountDetails,
) {}
