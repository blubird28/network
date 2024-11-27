import * as Joi from 'joi';

import { PubSubConfig, pubSubSchema } from './pub-sub.schema';

export interface BPSubscriptionPubSubConfig extends PubSubConfig {
  BP_SUBSCRIPTION_PUBSUB_PROJECT: string;
  BP_SUBSCRIPTION_PUBSUB_TOPIC: string;
  BP_SUBSCRIPTION_PUBSUB_SUBSCRIPTION: string;
}

export const BPSubscriptionPubSubSchema = pubSubSchema.concat(
  Joi.object<BPSubscriptionPubSubConfig>({
    BP_SUBSCRIPTION_PUBSUB_PROJECT: Joi.string().required(),
    BP_SUBSCRIPTION_PUBSUB_TOPIC: Joi.string().required(),
    BP_SUBSCRIPTION_PUBSUB_SUBSCRIPTION: Joi.string().required(),
  }).required(),
);
