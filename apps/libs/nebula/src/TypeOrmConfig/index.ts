import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { getTypeOrmConfig } from '../Config/utils/getTypeOrmConfig';
import { BaseConfig } from '../Config/schemas/base.schema';
import { PostgresConfig } from '../Config/schemas/postgres.schema';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService<BaseConfig & PostgresConfig>;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    const name = this.config.get('APP_NAME');
    return {
      ...getTypeOrmConfig(name, this.config, false),
      autoLoadEntities: true,
      migrationsRun: true,
      logging: ['migration', 'schema'],
      // name prop is deprecated in typeorm, but still used by nestjs/typeorm.
      // https://github.com/nestjs/typeorm/issues/66
      name,
    };
  }
}
