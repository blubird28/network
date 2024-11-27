import * as Joi from 'joi';

import { PubSubConfig, pubSubSchema } from './pub-sub.schema';

export interface BPPubSubConfig extends PubSubConfig {
  BP_BILLINGACCOUNT_PUBSUB_PROJECT: string;
  BP_BILLINGACCOUNT_PUBSUB_TOPIC: string;
  BP_BILLINGACCOUNT_PUBSUB_SUBSCRIPTION: string;
}

export const BPPubSubSchema = pubSubSchema.concat(
  Joi.object<BPPubSubConfig>({
    BP_BILLINGACCOUNT_PUBSUB_PROJECT: Joi.string().required(),
    BP_BILLINGACCOUNT_PUBSUB_TOPIC: Joi.string().required(),
    BP_BILLINGACCOUNT_PUBSUB_SUBSCRIPTION: Joi.string().required(),
  }).required(),
);
