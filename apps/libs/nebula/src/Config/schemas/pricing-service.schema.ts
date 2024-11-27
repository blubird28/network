import * as Joi from 'joi';

import * as Config from '@libs/nebula/Config';

export interface PricingConfig {
  PRICING_SERVICE_URL: string;
}

export const pricingServiceSchema = Joi.object<PricingConfig>({
  PRICING_SERVICE_URL: Joi.string().uri({ allowRelative: false }).required(),
}).required();

export const PricingConfigService = Config.forSchemas(
  'polaris',
  pricingServiceSchema,
);
