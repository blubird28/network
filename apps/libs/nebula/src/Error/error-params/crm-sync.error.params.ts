import HttpStatusCodes from 'http-status-codes';

import { ErrorKey } from '../constants';

export const CRMSyncErrorParams = new Map<ErrorKey, number>([
  ['InvalidMappingState', HttpStatusCodes.INTERNAL_SERVER_ERROR],
  ['CRMSyncError', HttpStatusCodes.INTERNAL_SERVER_ERROR],
  ['BackoffLimitExceeded', HttpStatusCodes.CONFLICT],
  ['BackoffFailedIncrementing', HttpStatusCodes.INTERNAL_SERVER_ERROR],
]);
