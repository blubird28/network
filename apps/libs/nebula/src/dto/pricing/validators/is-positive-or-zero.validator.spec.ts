import { IsPositiveOrZero } from './is-positive-or-zero.validator';

describe('IsPositiveOrZero', () => {
  let validator: IsPositiveOrZero;
  beforeEach(() => {
    validator = new IsPositiveOrZero();
  });

  describe('validate', () => {
    it('should return true if the value is a positive number', () => {
      const result = validator.validate(10);
      expect(result).toBe(true);
    });

    it('should return true if the value is zero', () => {
      const result = validator.validate(0);
      expect(result).toBe(true);
    });

    it('should return false if the value is a negative number', () => {
      const result = validator.validate(-5);
      expect(result).toBe(false);
    });

    it('should return the default error message with the property name', () => {
      const args = {
        property: 'testProperty',
        value: 5,
        object: {},
        constraints: [],
        targetName: 'TestClass',
        target: {},
      };
      const result = validator.defaultMessage(args);
      expect(result).toBe('testProperty must be a positive number or zero');
    });
  });
});
