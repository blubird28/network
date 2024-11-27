import * as Joi from 'joi';

export interface AppConfig {
  APP_PORT: number;
}

export const appSchema = Joi.object<AppConfig>({
  APP_PORT: Joi.number().integer().positive().required(),
}).required();
