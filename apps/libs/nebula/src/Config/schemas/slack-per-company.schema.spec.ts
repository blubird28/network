import { slackPerCompanySchema } from './slack-per-company.schema';

describe('config schema for slack per-company business rules', () => {
  const rawConfig =
    'test:/services/test:abc123,def234;blah:/services/blah:ghi345,jkl456;';
  const fullConfig = {
    SLACK_PER_COMPANY_CONFIG: rawConfig,
    SLACK_DEFAULT_HOOK_PATH: '/services/foo',
  };

  const expectedConfig = [
    {
      name: 'TEST',
      hookPath: '/services/test',
      ids: ['abc123', 'def234'],
    },
    {
      name: 'BLAH',
      hookPath: '/services/blah',
      ids: ['ghi345', 'jkl456'],
    },
  ];

  it('should pass for a valid config', () => {
    const result = slackPerCompanySchema.validate(fullConfig);
    expect(result.error).toBeUndefined();
    expect(result.value.SLACK_PER_COMPANY_CONFIG).toStrictEqual(expectedConfig);
  });

  it('should pass for a valid config without SLACK_PER_COMPANY_CONFIG', () => {
    const result = slackPerCompanySchema.validate({
      ...fullConfig,
      SLACK_PER_COMPANY_CONFIG: undefined,
    });
    expect(result.error).toBeUndefined();
    expect(result.value.SLACK_PER_COMPANY_CONFIG).toStrictEqual([]);
  });

  it('should throw for a missing SLACK_DEFAULT_HOOK_PATH', () => {
    const result = slackPerCompanySchema.validate({
      ...fullConfig,
      SLACK_DEFAULT_HOOK_PATH: undefined,
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toMatchInlineSnapshot(
      `"\\"SLACK_DEFAULT_HOOK_PATH\\" is required"`,
    );
  });

  it('should throw for an invalid line in SLACK_PER_COMPANY_CONFIG', () => {
    const result = slackPerCompanySchema.validate({
      ...fullConfig,
      SLACK_PER_COMPANY_CONFIG: `${rawConfig}oops`,
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toMatchInlineSnapshot(
      `"Failed to parse \\"SLACK_PER_COMPANY_CONFIG\\": Must have exactly 3 columns per row, separated by \\":\\" (while parsing line: \\"oops\\")"`,
    );
  });

  it('should throw for a line with blank name in SLACK_PER_COMPANY_CONFIG', () => {
    const result = slackPerCompanySchema.validate({
      ...fullConfig,
      SLACK_PER_COMPANY_CONFIG: `${rawConfig} :/services/foo/bar:xyz987`,
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toMatchInlineSnapshot(
      `"Failed to parse \\"SLACK_PER_COMPANY_CONFIG\\": First column (name) must not be blank (while parsing line: \\":/services/foo/bar:xyz987\\")"`,
    );
  });

  it('should throw for a line with blank hookPath in SLACK_PER_COMPANY_CONFIG', () => {
    const result = slackPerCompanySchema.validate({
      ...fullConfig,
      SLACK_PER_COMPANY_CONFIG: `${rawConfig}Name: :xyz987`,
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toMatchInlineSnapshot(
      `"Failed to parse \\"SLACK_PER_COMPANY_CONFIG\\": Second column (hookPath) must not be blank (while parsing line: \\"Name: :xyz987\\")"`,
    );
  });

  it('should normalize values in SLACK_PER_COMPANY_CONFIG', () => {
    const result = slackPerCompanySchema.validate({
      ...fullConfig,
      SLACK_PER_COMPANY_CONFIG:
        ';;   hook name   :  /services/foo/bar :    pqr567    ,,   ,, ttt765 , ;;',
    });
    expect(result.error).toBeUndefined();
    expect(result.value.SLACK_PER_COMPANY_CONFIG).toStrictEqual([
      {
        hookPath: '/services/foo/bar',
        ids: ['pqr567', 'ttt765'],
        name: 'HOOK NAME',
      },
    ]);
  });
});
