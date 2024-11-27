import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ShieldApiModule } from '@libs/nebula/Http/ShieldApi/shield-api.module';

import { TYPEORM_CONNECTION_NAME } from '../constants';
import ServiceLayerModule from '../service-layer/service-layer.module';
import OdpModule from '../odp/odp.module';
import ResourceModule from '../resource/resource.module';

import { PrefixSync } from './prefix-sync.entity';
import { ASNController } from './asn.controller';
import { ASNStoreService } from './asn-store.service';
import { ConsoleASNStoreService } from './console-asn-store.service';
import { ResourceASNStoreService } from './resource-asn-store.service';
import { PrefixSyncStoreService } from './prefix-sync-store.service';
import { PrefixSyncService } from './prefix-sync.service';
import { PrivateASNService } from './private-asn.service';
import { ScheduledPrefixSyncQueue } from './scheduled-prefix-sync/scheduled-prefix-sync.queue';
import { ScheduledPrefixSyncProvider } from './scheduled-prefix-sync/scheduled-prefix-sync.provider';
import { ScheduledPrefixSyncProcessor } from './scheduled-prefix-sync/scheduled-prefix-sync.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([PrefixSync], TYPEORM_CONNECTION_NAME),
    ScheduledPrefixSyncQueue(),
    ServiceLayerModule,
    OdpModule,
    ShieldApiModule,
    ResourceModule,
  ],
  controllers: [ASNController],
  providers: [
    ASNStoreService,
    ConsoleASNStoreService,
    ResourceASNStoreService,
    PrefixSyncStoreService,
    PrefixSyncService,
    PrivateASNService,
    ScheduledPrefixSyncProvider,
    ScheduledPrefixSyncProcessor,
  ],
  exports: [],
})
export default class ASNModule {}
