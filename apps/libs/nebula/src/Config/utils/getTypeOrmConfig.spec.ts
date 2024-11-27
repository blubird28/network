import { TlsOptions } from 'tls';
import fs from 'fs';

import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { PostgresConfig } from '../schemas/postgres.schema';
import { BaseConfig } from '../schemas/base.schema';

import { getTypeOrmConfig } from './getTypeOrmConfig';

describe('getTypeOrmConfig', () => {
  const name = 'app';
  const EXPECTED_CONFIG_BASE: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 9999,
    database: 'name',
    username: 'user',
    password: 'password',
    migrationsRun: false,
    migrationsTableName: 'typeorm_migrations',
    synchronize: false,
    namingStrategy: new SnakeNamingStrategy(),
    ssl: false,
    migrations: [`migrations/${name}/*.js`],
  };
  const SSL_PATHS = {
    POSTGRES_CA_PATH: '/etc/secrets/postgres_ca_cert',
    POSTGRES_CERT_PATH: '/etc/secrets/postgres_cert',
    POSTGRES_KEY_PATH: '/etc/secrets/postgres_key',
  };
  const EXPECTED_CONFIG_SSL: TlsOptions = {
    ca: `contents of ${SSL_PATHS.POSTGRES_CA_PATH}`,
    cert: `contents of ${SSL_PATHS.POSTGRES_CERT_PATH}`,
    key: `contents of ${SSL_PATHS.POSTGRES_KEY_PATH}`,
    rejectUnauthorized: false,
  };
  const EXPECTED_CONFIG_PATHS = {
    entities: [
      `@libs/nebula/entities/${name}/**/*.entity.ts`,
      `apps/${name}/src/**/*.entity.ts`,
    ],
  };

  const setupConfig = (withSsl = false) => {
    const { host, port, database, username, password } = EXPECTED_CONFIG_BASE;
    const config = {
      APP_NAME: name,
      POSTGRES_HOST: host,
      POSTGRES_PORT: port,
      POSTGRES_NAME: database,
      POSTGRES_USER: username,
      POSTGRES_PASSWORD: password as string,
      ...(withSsl ? SSL_PATHS : {}),
    };
    Object.keys(SSL_PATHS).forEach((key) => delete process.env[key]);
    Object.keys(config).forEach((key) => {
      process.env[key] = config[key];
    });
    return new ConfigService<BaseConfig & PostgresConfig>(config);
  };

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(fs, 'readFileSync').mockImplementation((file) => {
      if (file) return `contents of ${file}`;
      throw new Error('404: File not found');
    });
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
  });

  describe('with ssl configured', () => {
    let config;
    const expected = {
      ...EXPECTED_CONFIG_BASE,
      ssl: EXPECTED_CONFIG_SSL,
    };
    beforeEach(() => {
      config = setupConfig(true);
    });

    it('gets the expected values config using a config service (including entity entity paths)', () => {
      expect(getTypeOrmConfig('app', config)).toStrictEqual({
        ...expected,
        ...EXPECTED_CONFIG_PATHS,
      });
    });

    it('gets the expected values config using a config service (not including entity paths)', () => {
      expect(getTypeOrmConfig('app', config, false)).toStrictEqual(expected);
    });

    it('gets the expected values config using the default config getter (including entity paths)', () => {
      expect(getTypeOrmConfig('app')).toStrictEqual({
        ...expected,
        ...EXPECTED_CONFIG_PATHS,
      });
    });

    it('gets the expected values config using the default config getter (not including entity paths)', () => {
      expect(getTypeOrmConfig('app', undefined, false)).toStrictEqual(expected);
    });
  });

  describe('without ssl configured', () => {
    let config;
    const expected = {
      ...EXPECTED_CONFIG_BASE,
      ssl: false,
    };
    beforeEach(() => {
      config = setupConfig(false);
    });

    it('gets the expected values config using a config service (including entity paths)', () => {
      expect(getTypeOrmConfig('app', config)).toStrictEqual({
        ...expected,
        ...EXPECTED_CONFIG_PATHS,
      });
    });

    it('gets the expected values config using a config service (not including entity paths)', () => {
      expect(getTypeOrmConfig('app', config, false)).toStrictEqual(expected);
    });

    it('gets the expected values config using the default config getter (including entity paths)', () => {
      expect(getTypeOrmConfig('app')).toStrictEqual({
        ...expected,
        ...EXPECTED_CONFIG_PATHS,
      });
    });

    it('gets the expected values config using the default config getter (not including entity paths)', () => {
      expect(getTypeOrmConfig('app', undefined, false)).toStrictEqual(expected);
    });
  });
});
