import * as Joi from 'joi';

export interface ConsoleAppConfig {
  CONSOLE_APP_URL: string;
}

export const consoleAppSchema = Joi.object<ConsoleAppConfig>({
  CONSOLE_APP_URL: Joi.string().uri().required(),
}).required();
