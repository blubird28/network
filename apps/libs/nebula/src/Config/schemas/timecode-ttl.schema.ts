import * as Joi from 'joi';

import { DEFAULT_PRICE_TIMECODE_TTL } from '../config.constants';
export interface TimecodeTTLConfig {
  PRICE_TIMECODE_TTL: number;
}

export const timecodeTTLConfigSchema = Joi.object<TimecodeTTLConfig>({
  PRICE_TIMECODE_TTL: Joi.number()
    .required()
    .default(DEFAULT_PRICE_TIMECODE_TTL),
}).required();
