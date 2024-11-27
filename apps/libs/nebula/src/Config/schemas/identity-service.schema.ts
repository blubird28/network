import * as Joi from 'joi';

import { PubSubConfig, pubSubSchema } from './pub-sub.schema';

export interface IdentityServiceConfig extends PubSubConfig {
  IDENTITY_SERVICE_TOPIC?: string;
  IDENTITY_SERVICE_URL: string;
}

export const identityServiceSchema = pubSubSchema.concat(
  Joi.object<IdentityServiceConfig>({
    IDENTITY_SERVICE_TOPIC: Joi.string(),
    IDENTITY_SERVICE_URL: Joi.string().uri({ allowRelative: false }).required(),
  }).required(),
);
