import { ObjectSchema } from 'joi';

import { ConfigModule } from '@nestjs/config';

import { BaseConfig } from './schemas/base.schema';
import combineSchemas from './utils/combineSchemas';
import getConfigLocations from './utils/getConfigLocations';

export const forSchemas = <T = BaseConfig>(
  appName: string,
  ...schemas: Array<ObjectSchema>
) => {
  const { NODE_ENV = 'development' } = process.env;
  return ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: getConfigLocations(appName, NODE_ENV),
    ignoreEnvFile: NODE_ENV === 'production',
    validationSchema: combineSchemas<BaseConfig & T>(schemas),
    validationOptions: {
      stripUnknown: true,
      abortEarly: false,
    },
    cache: NODE_ENV === 'production',
  });
};
