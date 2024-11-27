import { Paginated, WithPaginatedDto } from '../paginated.dto';
import { ExternalType } from '../../utils/external-type';

import { CompanyBaseDto } from './company-base.dto';

@ExternalType<WithPaginatedDto<CompanyBaseDto>>()
export class PaginatedCompanyPublicDto extends Paginated(CompanyBaseDto) {}
