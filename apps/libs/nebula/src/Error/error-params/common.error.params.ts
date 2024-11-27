import HttpStatusCodes from 'http-status-codes';

import { ErrorKey } from '../constants';

export const CommonErrorParams = new Map<ErrorKey, number>([
  ['Unknown', HttpStatusCodes.INTERNAL_SERVER_ERROR],
  ['NotFound', HttpStatusCodes.NOT_FOUND],
  ['ValidationFailed', HttpStatusCodes.BAD_REQUEST],
  ['DataSyncConverterNotFound', HttpStatusCodes.INTERNAL_SERVER_ERROR],
  ['DataSyncFetcherNotFound', HttpStatusCodes.INTERNAL_SERVER_ERROR],
  ['Timeout', HttpStatusCodes.REQUEST_TIMEOUT],
  ['FailedToFetchToken', HttpStatusCodes.INTERNAL_SERVER_ERROR],
  ['UnserializedData', HttpStatusCodes.INTERNAL_SERVER_ERROR],
  ['Unauthorized', HttpStatusCodes.UNAUTHORIZED],
  ['FailedAccessCheck', HttpStatusCodes.FORBIDDEN],
  ['DatabaseError', HttpStatusCodes.INTERNAL_SERVER_ERROR],
  ['EnrichmentFailed', HttpStatusCodes.INTERNAL_SERVER_ERROR],
  ['FailedToResolveEnricherParams', HttpStatusCodes.INTERNAL_SERVER_ERROR],
  ['FailedToCompileTemplate', HttpStatusCodes.INTERNAL_SERVER_ERROR],
  ['FailedToExecuteTemplate', HttpStatusCodes.INTERNAL_SERVER_ERROR],
  ['InvalidTemplate', HttpStatusCodes.BAD_REQUEST],
  ['EnrichmentKeyClash', HttpStatusCodes.CONFLICT],
  ['NotFoundByIds', HttpStatusCodes.NOT_FOUND],
  ['UnimplementedJob', HttpStatusCodes.INTERNAL_SERVER_ERROR],
]);
