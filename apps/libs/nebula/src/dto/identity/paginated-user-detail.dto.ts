import { Paginated, WithPaginatedDto } from '../paginated.dto';
import { ExternalType } from '../../utils/external-type';

import { UserDetailDto } from './user-detail.dto';

@ExternalType<WithPaginatedDto<UserDetailDto>>()
export class PaginatedUserDetailDto extends Paginated(UserDetailDto) {}
