import * as Joi from 'joi';

import {
  DAY_IN_HOURS,
  HOUR_IN_MINUTES,
  MINUTE_IN_SECONDS,
  SECOND_IN_MILLIS,
  WEEK_IN_DAYS,
} from '@libs/nebula/basic-types';

const TWO = 2;
const FIVE = 5;
const FORTNIGHT_IN_SECONDS =
  TWO * WEEK_IN_DAYS * DAY_IN_HOURS * HOUR_IN_MINUTES * MINUTE_IN_SECONDS;
export const DEFAULT_FAILED_JOBS_COUNT = 1000;
export const DEFAULT_FAILED_JOBS_AGE = FORTNIGHT_IN_SECONDS;
export const DEFAULT_COMPLETED_JOBS_COUNT = 1000;
export const DEFAULT_COMPLETED_JOBS_AGE = FORTNIGHT_IN_SECONDS;
export const DEFAULT_RETRY_COUNT = 10;
export const DEFAULT_RETRY_DELAY = FIVE * SECOND_IN_MILLIS;
export const DEFAULT_SCHEDULE = '0 0 * * * *'; // start of every hour

export interface ScheduledPrefixSyncConfig {
  SCHEDULED_PREFIX_SYNC_FAILED_JOBS_COUNT: number;
  SCHEDULED_PREFIX_SYNC_FAILED_JOBS_AGE_SECONDS: number;
  SCHEDULED_PREFIX_SYNC_COMPLETED_JOBS_COUNT: number;
  SCHEDULED_PREFIX_SYNC_COMPLETED_JOBS_AGE_SECONDS: number;
  SCHEDULED_PREFIX_SYNC_RETRY_COUNT: number;
  SCHEDULED_PREFIX_SYNC_RETRY_DELAY_MILLIS: number;
  SCHEDULED_PREFIX_SYNC_ENABLED: boolean;
  SCHEDULED_PREFIX_SYNC_SCHEDULE: string;
}

export const scheduledPrefixSyncSchema = Joi.object<ScheduledPrefixSyncConfig>({
  SCHEDULED_PREFIX_SYNC_FAILED_JOBS_COUNT: Joi.number()
    .integer()
    .positive()
    .default(DEFAULT_FAILED_JOBS_COUNT),
  SCHEDULED_PREFIX_SYNC_FAILED_JOBS_AGE_SECONDS: Joi.number()
    .integer()
    .positive()
    .default(DEFAULT_FAILED_JOBS_AGE),
  SCHEDULED_PREFIX_SYNC_COMPLETED_JOBS_COUNT: Joi.number()
    .integer()
    .positive()
    .default(DEFAULT_COMPLETED_JOBS_COUNT),
  SCHEDULED_PREFIX_SYNC_COMPLETED_JOBS_AGE_SECONDS: Joi.number()
    .integer()
    .positive()
    .default(DEFAULT_COMPLETED_JOBS_AGE),
  SCHEDULED_PREFIX_SYNC_RETRY_COUNT: Joi.number()
    .integer()
    .positive()
    .default(DEFAULT_RETRY_COUNT),
  SCHEDULED_PREFIX_SYNC_RETRY_DELAY_MILLIS: Joi.number()
    .integer()
    .positive()
    .default(DEFAULT_RETRY_DELAY),
  SCHEDULED_PREFIX_SYNC_ENABLED: Joi.boolean()
    .truthy('1')
    .falsy('0')
    .default(false),
  SCHEDULED_PREFIX_SYNC_SCHEDULE: Joi.string().default(DEFAULT_SCHEDULE),
}).required();
