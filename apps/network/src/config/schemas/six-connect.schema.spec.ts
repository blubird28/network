import { sixConnectSchema } from './six-connect.schema';

describe('config schema for 6connect', () => {
  const fullConfig = {
    SIXCONNECT_LINKNET_RESOURCE_ID: 123,
    SIXCONNECT_LINKNET_ASSIGNED_RESOURCE_ID: 234,
    SIXCONNECT_LINKNET_TAGS: 'linknet',
    SIXCONNECT_PUBLIC_RESOURCE_ID: 345,
    SIXCONNECT_PUBLIC_ASSIGNED_RESOURCE_ID: 456,
    SIXCONNECT_PUBLIC_TAGS: 'public',
  };

  it('should pass for a valid config', () => {
    const result = sixConnectSchema.validate(fullConfig);
    expect(result.error).toBeUndefined();
  });
  Object.keys(fullConfig).forEach((key) => {
    it(`should throw for a missing ${key}`, () => {
      const result = sixConnectSchema.validate({
        ...fullConfig,
        [key]: undefined,
      });
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe(`"${key}" is required`);
    });
    it(`should throw for an invalid ${key}`, () => {
      const result = sixConnectSchema.validate({
        ...fullConfig,
        [key]: false,
      });
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toContain(`"${key}" must be`);
    });
  });
});
