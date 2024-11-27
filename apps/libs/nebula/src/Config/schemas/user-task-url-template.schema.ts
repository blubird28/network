import * as Joi from 'joi';

export interface UserTaskUrlTemplateConfig {
  USER_TASK_URL_TEMPLATE: string;
}
export const userTaskUrlTemplateSchema = Joi.object<UserTaskUrlTemplateConfig>({
  USER_TASK_URL_TEMPLATE: Joi.string().required(),
}).required();
