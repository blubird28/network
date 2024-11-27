import { slackHookSchema } from './slack-hook.schema';

describe('config schema for slack webhook api', () => {
  const fullConfig = {
    SLACK_BASE_URL: 'http://api',
    SLACK_HOOK_DEFAULT_COLOUR: '#000',
  };

  it('should pass for a valid config', () => {
    const result = slackHookSchema.validate(fullConfig);
    expect(result.error).toBeUndefined();
  });

  it('should pass for a valid config without colour', () => {
    const result = slackHookSchema.validate({
      ...fullConfig,
      SLACK_HOOK_DEFAULT_COLOUR: undefined,
    });
    expect(result.error).toBeUndefined();
    expect(result.value.SLACK_HOOK_DEFAULT_COLOUR).toBe('#c9c9c4');
  });

  it('should throw for a missing SLACK_BASE_URL', () => {
    const result = slackHookSchema.validate({
      ...fullConfig,
      SLACK_BASE_URL: undefined,
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('"SLACK_BASE_URL" is required');
  });

  it('should throw for an invalid SLACK_BASE_URL', () => {
    const result = slackHookSchema.validate({
      ...fullConfig,
      SLACK_BASE_URL: 'I dunno, google it',
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('"SLACK_BASE_URL" must be a valid uri');
  });
});
