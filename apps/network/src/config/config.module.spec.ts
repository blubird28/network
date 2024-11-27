import { testAppEnvironmentConfig } from '@libs/nebula/testing/config-testing';

import { schemas } from './config.module';

describe('network config', () => {
  testAppEnvironmentConfig('network', schemas);
});
