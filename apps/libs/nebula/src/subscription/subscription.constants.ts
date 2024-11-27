import HttpStatusCodes from 'http-status-codes';

export const REST_ADMIN_CREATE_SUBSCRIPTION_PATH = 'admin/subscriptions';
export const REST_ADMIN_SYNC_SUBSCRIPTION_PATH =
  'admin/subscriptions/:id/synchronization';
export const REST_GET_SUBSCRIPTION_BY_ID_PATH = '/subscriptions/:id';
export const REST_ADMIN_GET_SUBSCRIPTION_PATH = 'admin/subscriptions';
export const REST_GET_SUBSCRIPTION_PATH = '/subscriptions';
export const REST_ADMIN_TERMINATE_SUBSCRIPTION_PATH =
  'admin/subscriptions/:serviceId/terminate';

export const REST_GET_SUBSCRIPTION_PRODUCT_MAPPING_BY_BASE_PRODUCT_OFFERING =
  'admin/subscription-product-mapping/:ccBaseProductOfferingId';
export const REST_GET_SUBSCRIPTION_PRODUCT_MAPPING =
  'admin/subscription-product-mapping';
export const REST_UPDATE_SUBSCRIPTION_PRODUCT_MAPPING =
  'admin/subscription-product-mapping/:subscriptionProductMappingId';
export const REST_DELETE_SUBSCRIPTION_PRODUCT_MAPPING =
  'admin/subscription-product-mapping/:subscriptionProductMappingId';

export const REST_CREATE_INSIGHT_DETAILS = 'admin/insight-subscription-details';
export const REST_GET_INSIGHT_DETAILS = 'admin/insight-subscription-details';
export const REST_DELETE_INSIGHT_DETAILS =
  'admin/insight-subscription-details/:insightSubscriptionId';
export const REST_UPDATE_INSIGHT_DETAILS =
  'admin/insight-subscription-details/:insightSubscriptionId';

export const REST_GET_SUBSCRIPTION_ATTRIBUTE_ENRICHER_CONFIG_PATH =
  'admin/subscription-attribute-enricher-config/:productSpecificationId';
export const REST_DELETE_SUBSCRIPTION_ATTRIBUTE_ENRICHER_CONFIG_PATH =
  'admin/subscription-attribute-enricher-config/:id';
export const REST_UPDATE_SUBSCRIPTION_ATTRIBUTE_ENRICHER_CONFIG_PATH =
  'admin/subscription-attribute-enricher-config/:id';

export const SUBSCRIPTION_ERROR_KEYS = Object.freeze({
  [HttpStatusCodes.INTERNAL_SERVER_ERROR]: 'NoSubscriptionCreated',
  [HttpStatusCodes.NOT_FOUND]: 'SubscriptionNotFound',
  [HttpStatusCodes.BAD_REQUEST]: 'InvalidSubscription',
  [HttpStatusCodes.FORBIDDEN]: 'PermissionDenied',
  [HttpStatusCodes.UNAUTHORIZED]: 'Unauthorized',
  [HttpStatusCodes.GATEWAY_TIMEOUT]: 'NoSubscriptionCreated',
});

export const SUBSCRIPTION_PRODUCT_MAPPING_ERROR_KEYS = Object.freeze({
  [HttpStatusCodes.INTERNAL_SERVER_ERROR]:
    'NoSubscriptionProductMappingCreated',
  [HttpStatusCodes.NOT_FOUND]: 'SubscriptionProductMappingNotFound',
  [HttpStatusCodes.BAD_REQUEST]: 'InvalidSubscriptionProductMappingData',
  [HttpStatusCodes.FORBIDDEN]: 'PermissionDenied',
  [HttpStatusCodes.GATEWAY_TIMEOUT]: 'NoSubscriptionProductMappingCreated',
});

export const SUBSCRIPTION_ATTRIBUTE_ENRICHER_CONFIG_ERROR_KEYS = Object.freeze({
  [HttpStatusCodes.INTERNAL_SERVER_ERROR]: 'NoEnricherConfigUpdated',
  [HttpStatusCodes.BAD_REQUEST]: 'NoBodyFoundEnricherConfigUpdate',
  [HttpStatusCodes.NOT_FOUND]: 'SubscriptionEnricherConfigNotFound',
  [HttpStatusCodes.BAD_REQUEST]: 'SubscriptionAttributeEnrichHandlerInvalid',
});

export enum SUBSCRIPTION_STATUS {
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  TIMEOUT = 'TIMEOUT',
}

export const MAX_LENGTH_8 = 8;
export const MAX_LENGTH_10 = 10;
export const MAX_LENGTH_50 = 50;
export const MAX_LENGTH_120 = 120;

export const RATING_METHODS = ['Subscription', 'One Time Charge', 'Usage'];

export const SUCCESS_MESSAGE = `SUCCESS`;
