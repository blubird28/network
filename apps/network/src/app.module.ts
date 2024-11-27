import path from 'path';

import { I18nModule } from 'nestjs-i18n';

import { Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HeartbeatModule } from '@libs/nebula/Heartbeat/heartbeat.module';
import { PingModule } from '@libs/nebula/Ping/ping.module';
import { TypeOrmConfigService } from '@libs/nebula/TypeOrmConfig';
import { BullConnectionModule } from '@libs/nebula/Bull/bull-connection.module';

import { ConfigModule } from './config/config.module';
import OdpModule from './odp/odp.module';
import { TYPEORM_CONNECTION_NAME } from './constants';
import ResourceModule from './resource/resource.module';
import IpBlockModule from './ip-block/ip-block.module';
import ASNModule from './asn/asn.module';
import IoDModule from './iod/iod.module';
import ServiceLayerModule from './service-layer/service-layer.module';

@Module({
  imports: [
    ConfigModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '../../i18n'),
        watch: true,
      },
    }),
    BullConnectionModule(),
    TypeOrmModule.forRootAsync({
      // https://github.com/nestjs/typeorm/issues/48
      name: TYPEORM_CONNECTION_NAME,
      useClass: TypeOrmConfigService,
    }),
    HeartbeatModule,
    PingModule,
    OdpModule,
    ResourceModule,
    IpBlockModule,
    ASNModule,
    IoDModule,
    ASNModule,
    ServiceLayerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements OnApplicationShutdown {
  private readonly logger: Logger = new Logger(AppModule.name);
  async onApplicationShutdown(signal?: string): Promise<void> {
    this.logger.log('Received termination signal: %s', signal);
  }
}
