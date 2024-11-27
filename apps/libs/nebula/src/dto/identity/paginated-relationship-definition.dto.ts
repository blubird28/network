import { Paginated, WithPaginatedDto } from '../paginated.dto';
import { ExternalType } from '../../utils/external-type';

import { ReadRelationshipDefinitionDto } from './read-relationship-definition.dto';

@ExternalType<WithPaginatedDto<ReadRelationshipDefinitionDto>>()
export class PaginatedRelationshipDefinitionDto extends Paginated(
  ReadRelationshipDefinitionDto,
) {}
