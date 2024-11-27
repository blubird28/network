import * as Joi from 'joi';

export interface TimeoutConfig {
  REQUEST_TIMEOUT: number;
}
export const TimeoutSchema = Joi.object<TimeoutConfig>({
  REQUEST_TIMEOUT: Joi.number().positive().required(),
}).required();
