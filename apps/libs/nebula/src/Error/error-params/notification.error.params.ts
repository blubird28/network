import HttpStatusCodes from 'http-status-codes';

import { ErrorKey } from '../constants';

export const NotificationErrorParams = new Map<ErrorKey, number>([
  ['HandlerDoesNotExist', HttpStatusCodes.INTERNAL_SERVER_ERROR],
  ['EnricherDoesNotExist', HttpStatusCodes.INTERNAL_SERVER_ERROR],
  ['FailedToHandleNotification', HttpStatusCodes.INTERNAL_SERVER_ERROR],
  ['FailedToResolveNotificationParams', HttpStatusCodes.INTERNAL_SERVER_ERROR],
  ['NotificationHandlerInvalid', HttpStatusCodes.BAD_REQUEST],
  ['NotificationEnricherHandlerInvalid', HttpStatusCodes.BAD_REQUEST],
  ['InvalidPayloadMatcher', HttpStatusCodes.BAD_REQUEST],
  ['EmailTemplateNotFound', HttpStatusCodes.NOT_FOUND],
  ['SendgridError', HttpStatusCodes.INTERNAL_SERVER_ERROR],
]);
