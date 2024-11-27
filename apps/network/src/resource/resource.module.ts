import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TYPEORM_CONNECTION_NAME } from '../constants';

import { Resource } from './resource.entity';
import { Capability } from './capability.entity';
import { Usage } from './usage.entity';
import { CapabilityService } from './capability.service';
import { ResourceTransactionService } from './resource-transaction.service';
import { ResourceService } from './resource.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Resource, Capability, Usage],
      TYPEORM_CONNECTION_NAME,
    ),
  ],
  controllers: [],
  providers: [ResourceTransactionService, ResourceService, CapabilityService],
  exports: [ResourceTransactionService, ResourceService, CapabilityService],
})
export default class ResourceModule {}
