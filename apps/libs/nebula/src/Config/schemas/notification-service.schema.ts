import * as Joi from 'joi';

import { PubSubConfig, pubSubSchema } from './pub-sub.schema';

export interface NotificationServiceConfig extends PubSubConfig {
  NOTIFICATION_SERVICE_TOPIC?: string;
}

export const notificationServiceSchema = pubSubSchema.concat(
  Joi.object<NotificationServiceConfig>({
    NOTIFICATION_SERVICE_TOPIC: Joi.string(),
  }),
);
