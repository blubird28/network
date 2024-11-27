import * as path from 'path';
import * as fs from 'fs';
import { TlsOptions } from 'tls';

import * as dotenv from 'dotenv';
import { isUndefined } from 'lodash';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DataSourceOptions } from 'typeorm';

import { ConfigService } from '@nestjs/config';

import { BaseConfig } from '../schemas/base.schema';
import { PostgresConfig } from '../schemas/postgres.schema';

import getConfigLocations from './getConfigLocations';

type ConfigGetter = (
  key: keyof (BaseConfig & PostgresConfig),
  defaultVal?: string,
) => string;

const defaultConfigGetter: ConfigGetter = (key, defaultVal) => {
  if (isUndefined(process.env[key])) {
    if (isUndefined(defaultVal)) {
      throw new Error('Missing config: ' + key);
    }
    return defaultVal;
  }
  return process.env[key];
};

const maybeGetSSLConfig = (configGetter: ConfigGetter): TlsOptions | false => {
  try {
    const ca = fs.readFileSync(configGetter('POSTGRES_CA_PATH')).toString();
    const cert = fs.readFileSync(configGetter('POSTGRES_CERT_PATH')).toString();
    const key = fs.readFileSync(configGetter('POSTGRES_KEY_PATH')).toString();
    if (ca && cert && key) {
      return {
        ca,
        cert,
        key,
        rejectUnauthorized: false,
      };
    }
  } catch (e) {}

  return false;
};

export const getTypeOrmConfig = (
  appName: string,
  configService?: ConfigService<BaseConfig & PostgresConfig>,
  fromCli = true,
): DataSourceOptions => {
  const configGetter: ConfigGetter = configService
    ? configService.get.bind(configService)
    : defaultConfigGetter;
  const env = configGetter('NODE_ENV', 'development');
  if (!configService && env !== 'production') {
    getConfigLocations(appName, env)
      .map((file) => path.resolve(process.cwd(), file))
      .filter(fs.existsSync)
      .forEach((path) => {
        dotenv.config({ path });
      });
  }

  const config: DataSourceOptions = {
    type: 'postgres',
    host: configGetter('POSTGRES_HOST'),
    port: parseInt(configGetter('POSTGRES_PORT'), 10),
    database: configGetter('POSTGRES_NAME'),
    username: configGetter('POSTGRES_USER'),
    password: configGetter('POSTGRES_PASSWORD'),
    migrationsRun: false,
    migrationsTableName: 'typeorm_migrations',
    synchronize: false,
    namingStrategy: new SnakeNamingStrategy(),
    ssl: maybeGetSSLConfig(configGetter),
    migrations: [`migrations/${appName}/*.js`],
  };

  if (fromCli) {
    return {
      ...config,
      entities: [
        `@libs/nebula/entities/${appName}/**/*.entity.ts`,
        `apps/${appName}/src/**/*.entity.ts`,
      ],
    };
  }

  return config;
};
