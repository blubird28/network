import { SECOND_IN_MILLIS } from '@libs/nebula/basic-types';

import { DEFAULT_SL_TIMEOUT, serviceLayerSchema } from './service-layer.schema';

describe('config schema for service layer', () => {
  const urlConfig = {
    SERVICE_LAYER_URL: 'https://sl',
    SERVICE_LAYER_CALLBACK_URL_BASE: 'http://callback',
  };
  const requiredConfig = {
    ...urlConfig,
    SERVICE_LAYER_AUTH_TOKEN: 'superSecretSauce',
  };
  const fullConfig = {
    ...requiredConfig,
    SERVICE_LAYER_REQUEST_TIMEOUT_MS: '100000',
  };

  it('should pass for a valid config', () => {
    const result = serviceLayerSchema.validate(fullConfig);
    expect(result.error).toBeUndefined();
  });

  it(`defaults timeout`, () => {
    const result = serviceLayerSchema.validate(requiredConfig);
    expect(result.error).toBeUndefined();
    expect(result.value.SERVICE_LAYER_REQUEST_TIMEOUT_MS).toBe(
      DEFAULT_SL_TIMEOUT,
    );
  });

  Object.keys(requiredConfig).forEach((key) => {
    it(`should throw for a missing ${key}`, () => {
      const result = serviceLayerSchema.validate({
        ...fullConfig,
        [key]: undefined,
      });
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe(`"${key}" is required`);
    });
  });

  Object.keys(urlConfig).forEach((key) => {
    it(`should throw for an invalid ${key}`, () => {
      const result = serviceLayerSchema.validate({
        ...fullConfig,
        [key]: 'not a url',
      });
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toContain(`"${key}" must be`);
    });
  });
});
