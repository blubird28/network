import * as Joi from 'joi';

export interface EmailConfig {
  CONSOLE_FROM_EMAIL_NAME: string;
  CONSOLE_FROM_EMAIL: string;
  SUPPORT_EMAIL: string;
}

export const emailSchema = Joi.object<EmailConfig>({
  CONSOLE_FROM_EMAIL_NAME: Joi.string(),
  CONSOLE_FROM_EMAIL: Joi.string(),
  SUPPORT_EMAIL: Joi.string().email().required(),
}).required();
