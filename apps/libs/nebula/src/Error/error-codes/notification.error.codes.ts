export enum NotificationErrorCodes {
  HandlerDoesNotExist = 'notification.handler_does_not_exist',
  FailedToHandleNotification = 'notification.failed_to_handle_notification',
  FailedToResolveNotificationParams = 'notification.failed_to_resolve_notification_params',
  NotificationHandlerInvalid = 'notification.notification_handler_invalid',
  NotificationEnricherHandlerInvalid = 'notification.notification_enricher_handler_invalid',
  InvalidTemplate = 'notification.invalid_template',
  InvalidPayloadMatcher = 'notification.invalid_payload_matcher',
  EmailTemplateNotFound = 'notification.email_template_not_found',
  SendgridError = 'notification.sendgrid_error',
}
