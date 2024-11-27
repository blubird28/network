import {
  DEFAULT_BACKOFF_LIMIT,
  DEFAULT_BACKOFF_TIME,
  crmSyncBackoffSchema,
} from './crm-sync-backoff.schema';

describe('configuration schema for CRM sync backoff', () => {
  const fullConfig = {
    CRM_SYNC_BACKOFF_LIMIT: '10',
    CRM_SYNC_BACKOFF_TIME: '5000',
  };

  it('gives us a valid configuration object', () => {
    expect.hasAssertions();

    const result = crmSyncBackoffSchema.validate(fullConfig);

    expect(result.error).toBeUndefined();
    expect(result.value).toStrictEqual({
      CRM_SYNC_BACKOFF_LIMIT: 10,
      CRM_SYNC_BACKOFF_TIME: 5000,
    });
  });

  it('sets defaults', () => {
    expect.hasAssertions();

    const result = crmSyncBackoffSchema.validate({});

    expect(result.error).toBeUndefined();
    expect(result.value).toStrictEqual({
      CRM_SYNC_BACKOFF_LIMIT: DEFAULT_BACKOFF_LIMIT,
      CRM_SYNC_BACKOFF_TIME: DEFAULT_BACKOFF_TIME,
    });
  });
});
