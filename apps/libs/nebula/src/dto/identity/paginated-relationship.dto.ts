import { Paginated, WithPaginatedDto } from '../paginated.dto';
import { ExternalType } from '../../utils/external-type';

import { RelationshipDto } from './relationship.dto';

@ExternalType<WithPaginatedDto<RelationshipDto>>()
export class PaginatedRelationshipDto extends Paginated(RelationshipDto) {}
