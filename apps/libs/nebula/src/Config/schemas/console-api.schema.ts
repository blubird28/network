import * as Joi from 'joi';

export interface ConsoleApiConfig {
  CONSOLE_PUBLIC_API_URL: string;
}

export const consoleApiSchema = Joi.object<ConsoleApiConfig>({
  CONSOLE_PUBLIC_API_URL: Joi.string().uri().required(),
}).required();
