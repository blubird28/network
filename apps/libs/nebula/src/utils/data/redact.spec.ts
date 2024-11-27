import * as redact from './redact';

describe('key redaction util', () => {
  const toRedact = {
    accessToken: 'camel cased value',
    access_token: 'snake cased value',
    'access-token': 'kebab cased value',
    aCceSsTOkeN: 'spongebob cased value',
    accessTokenWithFries: 'not matched by full search value',
    in: {
      too: {
        deep: 'Sum 41 value',
      },
    },
    list: [
      { secret: 'squirrel', open: 'orangutan' },
      { open: 'ostrich' },
      [{ secret: { nested: 'sparrow' }, open: 'ocelot' }],
    ],
  };

  it('does not mutate', () => {
    const redacted = redact.byKeys()(toRedact);
    expect(redacted).toStrictEqual(toRedact);
    expect(redacted).not.toBe(toRedact);
  });

  it('matches by regex', () => {
    const redacted = redact.byKeys(/access/)(toRedact);
    expect(redacted.accessToken).toBe(redact.REDACTED);
    expect(redacted.access_token).toBe(redact.REDACTED);
    expect(redacted.accessTokenWithFries).toBe(redact.REDACTED);
    expect(redacted['access-token']).toBe(redact.REDACTED);

    // Not matched by regex (insensitive flag not passed)
    expect(redacted.aCceSsTOkeN).not.toBe(redact.REDACTED);
  });

  it('matches by search config (default)', () => {
    const redacted = redact.byKeys({ keySearch: 'accessToken' })(toRedact);
    expect(redacted.accessToken).toBe(redact.REDACTED);
    expect(redacted.access_token).toBe(redact.REDACTED);
    expect(redacted.aCceSsTOkeN).toBe(redact.REDACTED);
    expect(redacted['access-token']).toBe(redact.REDACTED);

    // Not matched by search config (full search by default)
    expect(redacted.accessTokenWithFries).not.toBe(redact.REDACTED);
  });

  it('matches by search config (no kebab)', () => {
    const redacted = redact.byKeys({ keySearch: 'accessToken', kebab: false })(
      toRedact,
    );
    expect(redacted.accessToken).toBe(redact.REDACTED);
    expect(redacted.access_token).toBe(redact.REDACTED);
    expect(redacted.aCceSsTOkeN).toBe(redact.REDACTED);

    // Not matched by search config (kebab case false)
    expect(redacted['access-token']).not.toBe(redact.REDACTED);
  });

  it('matches by search config (no snake)', () => {
    const redacted = redact.byKeys({ keySearch: 'accessToken', snake: false })(
      toRedact,
    );
    expect(redacted.accessToken).toBe(redact.REDACTED);
    expect(redacted.aCceSsTOkeN).toBe(redact.REDACTED);
    expect(redacted['access-token']).toBe(redact.REDACTED);

    // Not matched by search config (snake case false)
    expect(redacted.access_token).not.toBe(redact.REDACTED);
  });

  it('matches by search config (not full)', () => {
    const redacted = redact.byKeys({ keySearch: 'accessToken', full: false })(
      toRedact,
    );
    expect(redacted.accessToken).toBe(redact.REDACTED);
    expect(redacted.aCceSsTOkeN).toBe(redact.REDACTED);
    expect(redacted['access-token']).toBe(redact.REDACTED);
    expect(redacted.access_token).toBe(redact.REDACTED);
  });

  it('matches by string', () => {
    const redacted = redact.byKeys('accessToken')(toRedact);
    expect(redacted.accessToken).toBe(redact.REDACTED);
    expect(redacted.access_token).toBe(redact.REDACTED);
    expect(redacted.aCceSsTOkeN).toBe(redact.REDACTED);
    expect(redacted['access-token']).toBe(redact.REDACTED);

    // Not matched by string (full search by default)
    expect(redacted.accessTokenWithFries).not.toBe(redact.REDACTED);
  });

  it('matches nested tokens (leaf)', () => {
    const redacted = redact.byKeys('deep')(toRedact);
    expect(redacted).toHaveProperty('in.too.deep', redact.REDACTED);
  });

  it('matches nested tokens (branch)', () => {
    const redacted = redact.byKeys('too')(toRedact);
    expect(redacted).toHaveProperty('in.too', redact.REDACTED);
  });

  it('matches nested tokens (list)', () => {
    const redacted = redact.byKeys('secret')(toRedact);
    expect(redacted.list).toStrictEqual([
      { open: 'orangutan', secret: redact.REDACTED },
      { open: 'ostrich' },
      [{ open: 'ocelot', secret: redact.REDACTED }],
    ]);
  });
});
