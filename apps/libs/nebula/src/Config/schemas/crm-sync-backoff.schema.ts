import * as Joi from 'joi';

import { MINUTE_IN_SECONDS, SECOND_IN_MILLIS } from '@libs/nebula/basic-types';

export const DEFAULT_BACKOFF_LIMIT = 5;
export const DEFAULT_BACKOFF_TIME = MINUTE_IN_SECONDS * SECOND_IN_MILLIS; // One minute

export interface CRMSyncBackoffConfig {
  // How many sync operations should be allowed for a record within the time period
  CRM_SYNC_BACKOFF_LIMIT: number;
  // The time period (in ms) to count sync operations for
  CRM_SYNC_BACKOFF_TIME: number;
}

export const crmSyncBackoffSchema = Joi.object<CRMSyncBackoffConfig>({
  CRM_SYNC_BACKOFF_LIMIT: Joi.number().min(1).default(DEFAULT_BACKOFF_LIMIT),
  CRM_SYNC_BACKOFF_TIME: Joi.number().min(1).default(DEFAULT_BACKOFF_TIME),
}).required();
