import { NotificationDto } from '@libs/nebula/dto/mercury/notification.dto';
import { Paginated, WithPaginatedDto } from '@libs/nebula/dto/paginated.dto';
import { ExternalType } from '@libs/nebula/utils/external-type';
import { NotificationTriggerDto } from '@libs/nebula/dto/mercury/notification-trigger.dto';

@ExternalType<WithPaginatedDto<NotificationDto>>()
export class PaginatedNotificationTriggerDto extends Paginated(
  NotificationTriggerDto,
) {}
