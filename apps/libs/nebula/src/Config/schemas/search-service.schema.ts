import * as Joi from 'joi';

import { PubSubConfig, pubSubSchema } from './pub-sub.schema';

export interface SearchServiceConfig extends PubSubConfig {
  SEARCH_SERVICE_TOPIC: string;
  SEARCH_SERVICE_URL: string;
}

export const searchServiceSchema = pubSubSchema.concat(
  Joi.object<SearchServiceConfig>({
    SEARCH_SERVICE_TOPIC: Joi.string().required(),
    SEARCH_SERVICE_URL: Joi.string().uri({ allowRelative: false }).required(),
  }).required(),
);
