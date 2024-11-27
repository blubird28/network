import {
  DEFAULT_COMPLETED_JOBS_AGE,
  DEFAULT_COMPLETED_JOBS_COUNT,
  DEFAULT_FAILED_JOBS_AGE,
  DEFAULT_FAILED_JOBS_COUNT,
  DEFAULT_RETRY_COUNT,
  DEFAULT_RETRY_DELAY,
  DEFAULT_SCHEDULE,
  ScheduledPrefixSyncConfig,
  scheduledPrefixSyncSchema,
} from './scheduled-prefix-sync.schema';

describe('config schema for service layer', () => {
  const fullConfig: Record<keyof ScheduledPrefixSyncConfig, string> = {
    SCHEDULED_PREFIX_SYNC_FAILED_JOBS_COUNT: '5',
    SCHEDULED_PREFIX_SYNC_FAILED_JOBS_AGE_SECONDS: '100',
    SCHEDULED_PREFIX_SYNC_COMPLETED_JOBS_COUNT: '5',
    SCHEDULED_PREFIX_SYNC_COMPLETED_JOBS_AGE_SECONDS: '100',
    SCHEDULED_PREFIX_SYNC_RETRY_COUNT: '9',
    SCHEDULED_PREFIX_SYNC_RETRY_DELAY_MILLIS: '3000',
    SCHEDULED_PREFIX_SYNC_ENABLED: 'true',
    SCHEDULED_PREFIX_SYNC_SCHEDULE: '0 30 0,6,12,18 * * *',
  };
  const fullParsedConfig: ScheduledPrefixSyncConfig = {
    SCHEDULED_PREFIX_SYNC_FAILED_JOBS_COUNT: 5,
    SCHEDULED_PREFIX_SYNC_FAILED_JOBS_AGE_SECONDS: 100,
    SCHEDULED_PREFIX_SYNC_COMPLETED_JOBS_COUNT: 5,
    SCHEDULED_PREFIX_SYNC_COMPLETED_JOBS_AGE_SECONDS: 100,
    SCHEDULED_PREFIX_SYNC_RETRY_COUNT: 9,
    SCHEDULED_PREFIX_SYNC_RETRY_DELAY_MILLIS: 3000,
    SCHEDULED_PREFIX_SYNC_ENABLED: true,
    SCHEDULED_PREFIX_SYNC_SCHEDULE: '0 30 0,6,12,18 * * *',
  };
  const defaultConfig: ScheduledPrefixSyncConfig = {
    SCHEDULED_PREFIX_SYNC_FAILED_JOBS_COUNT: DEFAULT_FAILED_JOBS_COUNT,
    SCHEDULED_PREFIX_SYNC_FAILED_JOBS_AGE_SECONDS: DEFAULT_FAILED_JOBS_AGE,
    SCHEDULED_PREFIX_SYNC_COMPLETED_JOBS_COUNT: DEFAULT_COMPLETED_JOBS_COUNT,
    SCHEDULED_PREFIX_SYNC_COMPLETED_JOBS_AGE_SECONDS:
      DEFAULT_COMPLETED_JOBS_AGE,
    SCHEDULED_PREFIX_SYNC_RETRY_COUNT: DEFAULT_RETRY_COUNT,
    SCHEDULED_PREFIX_SYNC_RETRY_DELAY_MILLIS: DEFAULT_RETRY_DELAY,
    SCHEDULED_PREFIX_SYNC_ENABLED: false,
    SCHEDULED_PREFIX_SYNC_SCHEDULE: DEFAULT_SCHEDULE,
  };

  it('should pass for a valid config', () => {
    const result = scheduledPrefixSyncSchema.validate(fullConfig);
    expect(result.error).toBeUndefined();
    expect(result.value).toStrictEqual(fullParsedConfig);
  });

  it(`sets defaults`, () => {
    const result = scheduledPrefixSyncSchema.validate({});
    expect(result.error).toBeUndefined();
    expect(result.value).toStrictEqual(defaultConfig);
  });

  Object.keys(fullConfig).forEach((key) => {
    it(`should throw for an invalid ${key}`, () => {
      const result = scheduledPrefixSyncSchema.validate({
        ...fullConfig,
        [key]: {},
      });
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toContain(`"${key}" must be`);
    });
  });
});
