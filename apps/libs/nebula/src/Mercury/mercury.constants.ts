export const MESSAGE_PATTERN_SLACK_SEND_BY_COMPANY = {
  type: 'slackSendByCompany',
};
export const MESSAGE_PATTERN_SLACK_SEND_BY_NAME = { type: 'slackSendByName' };
export const MESSAGE_PATTERN_SLACK_SEND_TO_DEFAULT = {
  type: 'slackSendToDefault',
};

export const MESSAGE_PATTERN_ORDER_CREATED = { eventType: 'ORDER_CREATED' };
export const MESSAGE_PATTERN_ORDER_UPDATED = { eventType: 'ORDER_UPDATED' };

export const MESSAGE_PATTERN_USER_TASK_CREATED = {
  eventType: 'USER_TASK_CREATED',
};

export const MESSAGE_PATTERN_SERVICE_CREATED = { eventType: 'SERVICE_CREATED' };
export const MESSAGE_PATTERN_SERVICE_UPDATED = { eventType: 'SERVICE_UPDATED' };
export const MESSAGE_PATTERN_SERVICE_DELETED = { eventType: 'SERVICE_DELETED' };

export const REST_CONFIG_NOTIFICATION_PATH = 'config/notification';
export const REST_CONFIG_NOTIFICATION_TRIGGER_PATH =
  'config/notification-trigger';
export const REST_CONFIG_NOTIFICATION_ENRICHER_PATH =
  'config/notification-enricher';
export const REST_CONFIG_NOTIFICATION_ID_PATH = ':notificationId';
export const REST_CONFIG_NOTIFICATION_TRIGGER_ID_PATH = ':triggerId';
export const REST_CONFIG_NOTIFICATION_ENRICHER_ID_PATH = ':enricherId';
