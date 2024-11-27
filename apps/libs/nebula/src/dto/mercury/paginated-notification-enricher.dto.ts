import { NotificationDto } from '@libs/nebula/dto/mercury/notification.dto';
import { Paginated, WithPaginatedDto } from '@libs/nebula/dto/paginated.dto';
import { ExternalType } from '@libs/nebula/utils/external-type';
import { NotificationEnricherDto } from '@libs/nebula/dto/mercury/notification-enricher.dto';

@ExternalType<WithPaginatedDto<NotificationDto>>()
export class PaginatedNotificationEnricherDto extends Paginated(
  NotificationEnricherDto,
) {}
