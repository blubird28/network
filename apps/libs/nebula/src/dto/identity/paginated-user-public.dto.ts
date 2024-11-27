import { Paginated, WithPaginatedDto } from '../paginated.dto';
import { ExternalType } from '../../utils/external-type';

import { UserPublicDto } from './user-public.dto';

@ExternalType<WithPaginatedDto<UserPublicDto>>()
export class PaginatedUserPublicDto extends Paginated(UserPublicDto) {}
