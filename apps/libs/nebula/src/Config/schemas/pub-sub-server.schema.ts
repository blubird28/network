import * as Joi from 'joi';

import parseColumnarConfig from '../utils/parseColumnarConfig';

import { PubSubConfig, pubSubSchema } from './pub-sub.schema';

export interface AdditionalPubSubServerConfig {
  topicName: string;
  subscriptionName: string;
}

export interface PubSubServerConfig extends PubSubConfig {
  PUBSUB_TOPIC: string;
  PUBSUB_SUBSCRIPTION: string;
  PUBSUB_ADDITIONAL_SUBSCRIPTIONS: AdditionalPubSubServerConfig[];
}

const TWO_COLUMNS = 2;

const parseAdditionalPubSubServerConfig = (
  value: string,
): AdditionalPubSubServerConfig[] => {
  if (value) {
    return parseColumnarConfig(
      value,
      TWO_COLUMNS,
      ([topicName, subscriptionName], errSuffix) => {
        if (!topicName) {
          throw new Error(
            `First column (topicName) must not be blank ${errSuffix}`,
          );
        }
        if (!subscriptionName) {
          throw new Error(
            `Second column (subscriptionName) must not be blank ${errSuffix}`,
          );
        }
        return { topicName, subscriptionName };
      },
    );
  }
  return undefined;
};

export const pubSubServerSchema = pubSubSchema.concat(
  Joi.object<PubSubServerConfig>({
    PUBSUB_TOPIC: Joi.string().required(),
    PUBSUB_SUBSCRIPTION: Joi.string().required(),
    PUBSUB_ADDITIONAL_SUBSCRIPTIONS: Joi.string()
      .custom(parseAdditionalPubSubServerConfig)
      .default([])
      .messages({
        'any.custom': 'Failed to parse {{#label}}: {{#error.message}}',
      }),
  }).required(),
) as Joi.ObjectSchema<PubSubServerConfig>;
