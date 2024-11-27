import getErrorMessage from './getErrorMessage';

describe('getErrorMessage', () => {
  const withOverrideCases: [string, boolean][] = [
    ['with an overridden default', true],
    ['without an overridden default', false],
  ];
  const cases: [string, any, string?][] = [
    ['a boolean', true],
    ['null', null],
    ['undefined', undefined],
    ['an actual error', new Error('Computer says no'), 'Computer says no'],
    ['a number', 13],
    ['a string', 'thread'],
    ['an object', { foo: 14 }],
    [
      'an object with a message property',
      { message: 'in a bottle' },
      'in a bottle',
    ],
  ];
  const override = 'An error from the deep, unknown to science';

  withOverrideCases.forEach(([withOverride, shouldOverride]) => {
    describe(withOverride, () => {
      const expectDefault = shouldOverride
        ? 'the overridden default'
        : 'the default';
      const call = shouldOverride
        ? (val) => getErrorMessage(val, override)
        : (val) => getErrorMessage(val);
      cases.forEach(([given, value, message]) => {
        const expected = message ? 'the message' : expectDefault;
        const expectedValue =
          message ?? (shouldOverride ? override : 'Unknown error');
        it(`given ${given}, expect ${expected}`, () => {
          expect(call(value)).toBe(expectedValue);
        });
      });
    });
  });
});
