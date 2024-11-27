import * as Joi from 'joi';

export interface CRMPubSubConfig {
  CRM_PUBSUB_PROJECT_ID: string;
  CRM_PUBSUB_COMPANY_TOPIC: string;
  CRM_PUBSUB_CONTACT_TOPIC: string;
  CRM_PUBSUB_COMPANY_RESPONSE_SUBSCRIPTION: string;
  CRM_PUBSUB_CONTACT_RESPONSE_SUBSCRIPTION: string;
  CRM_PUBSUB_CUSTOMER_MASTER_TOPIC: string;
  CRM_PUBSUB_CUSTOMER_MASTER_SUBSCRIPTION: string;
}

export const crmPubSubSchema = Joi.object<CRMPubSubConfig>({
  CRM_PUBSUB_PROJECT_ID: Joi.string().required(),
  CRM_PUBSUB_COMPANY_TOPIC: Joi.string().required(),
  CRM_PUBSUB_CONTACT_TOPIC: Joi.string().required(),
  CRM_PUBSUB_COMPANY_RESPONSE_SUBSCRIPTION: Joi.string().required(),
  CRM_PUBSUB_CONTACT_RESPONSE_SUBSCRIPTION: Joi.string().required(),
  CRM_PUBSUB_CUSTOMER_MASTER_TOPIC: Joi.string().required(),
  CRM_PUBSUB_CUSTOMER_MASTER_SUBSCRIPTION: Joi.string().required(),
}).required();
