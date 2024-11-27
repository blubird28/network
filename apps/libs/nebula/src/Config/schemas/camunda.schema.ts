import * as Joi from 'joi';

export interface CamundaConfig {
  CAMUNDA_BASE_URL: string;
  CAMUNDA_BASE_PATH: string;
}

export const camundaSchema = Joi.object<CamundaConfig>({
  CAMUNDA_BASE_URL: Joi.string().required(),
  CAMUNDA_BASE_PATH: Joi.string().required(),
}).required();
