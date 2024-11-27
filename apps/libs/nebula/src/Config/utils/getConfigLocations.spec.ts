import getConfigLocations from './getConfigLocations';

describe('getConfigLocations', () => {
  it('gets the expected locations', () => {
    expect.hasAssertions();
    expect(getConfigLocations('some-app', 'development'))
      .toMatchInlineSnapshot(`
      Array [
        "apps/some-app/.env.local",
        "apps/some-app/.env.development",
        "apps/some-app/.env",
        ".env.local",
        ".env.development",
        ".env",
      ]
    `);
  });
});
