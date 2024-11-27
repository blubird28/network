import * as Joi from 'joi';

export interface PubSubConfig {
  PUBSUB_PROJECT: string;
  PUBSUB_EMULATOR_HOST?: string;
}

export const pubSubSchema = Joi.object<PubSubConfig>({
  PUBSUB_PROJECT: Joi.string().required(),
  PUBSUB_EMULATOR_HOST: Joi.string().optional(),
}).required();
