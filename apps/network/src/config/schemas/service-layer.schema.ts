import * as Joi from 'joi';

import { SECOND_IN_MILLIS } from '@libs/nebula/basic-types';

const THIRTY = 30;
export const DEFAULT_SL_TIMEOUT = THIRTY * SECOND_IN_MILLIS;

export interface ServiceLayerConfig {
  SERVICE_LAYER_URL: string;
  SERVICE_LAYER_AUTH_TOKEN: string;
  SERVICE_LAYER_REQUEST_TIMEOUT_MS: number;
  SERVICE_LAYER_CALLBACK_URL_BASE: string;
}

export const serviceLayerSchema = Joi.object<ServiceLayerConfig>({
  SERVICE_LAYER_URL: Joi.string().uri({ allowRelative: false }).required(),
  SERVICE_LAYER_CALLBACK_URL_BASE: Joi.string()
    .uri({ allowRelative: false })
    .required(),
  SERVICE_LAYER_AUTH_TOKEN: Joi.string().required(),
  SERVICE_LAYER_REQUEST_TIMEOUT_MS: Joi.number()
    .integer()
    .positive()
    .default(DEFAULT_SL_TIMEOUT),
}).required();
