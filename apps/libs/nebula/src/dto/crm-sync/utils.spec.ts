import {
  isValidBusinessType,
  toValidBusinessType,
  VALID_BUSINESS_TYPE,
} from './utils';

describe('crm sync utils', () => {
  const validTypes: [string][] = Object.keys(VALID_BUSINESS_TYPE).map(
    (type) => [type],
  );
  const invalidTypes: { val: unknown; name: string }[] = [
    { val: 'another string', name: 'another string' },
    { val: null, name: 'null' },
    { val: true, name: 'boolean' },
    { val: undefined, name: 'undefined' },
    { val: { an: 'object' }, name: 'an object' },
    { val: [], name: 'an array' },
  ];
  describe('isValidBusinessType', () => {
    it.each(validTypes)('%s is a valid business type', (val) => {
      expect.hasAssertions();

      expect(isValidBusinessType(val)).toBe(true);
    });
    it.each(invalidTypes)('$name is not a valid business type', ({ val }) => {
      expect.hasAssertions();

      expect(isValidBusinessType(val)).toBe(false);
    });
  });
  describe('toValidBusinessType', () => {
    it.each(validTypes)('%s returns %s', (val) => {
      expect.hasAssertions();

      expect(toValidBusinessType(val)).toBe(val);
    });
    it.each(invalidTypes)('$name returns undefined', ({ val }) => {
      expect.hasAssertions();

      expect(toValidBusinessType(val)).toBeUndefined();
    });
  });
});
