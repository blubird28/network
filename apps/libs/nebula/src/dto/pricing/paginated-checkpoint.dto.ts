import { Paginated, WithPaginatedDto } from '../paginated.dto';
import { ExternalType } from '../../utils/external-type';

import { CheckpointDto } from './checkpoint.dto';

@ExternalType<WithPaginatedDto<CheckpointDto>>()
export class PaginatedCheckpointDto extends Paginated(CheckpointDto) {}
