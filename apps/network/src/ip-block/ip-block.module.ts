import { Module } from '@nestjs/common';

import ResourceModule from '../resource/resource.module';
import OdpModule from '../odp/odp.module';

import { IpBlockController } from './ip-block.controller';
import { IpBlockService } from './ip-block.service';

@Module({
  imports: [ResourceModule, OdpModule],
  controllers: [IpBlockController],
  providers: [IpBlockService],
  exports: [],
})
export default class IpBlockModule {}
