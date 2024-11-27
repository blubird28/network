import { Module } from '@nestjs/common';

import ResourceModule from '../resource/resource.module';

import { IoDService } from './iod.service';
import { IoDController } from './iod.controller';

@Module({
  imports: [ResourceModule],
  controllers: [IoDController],
  providers: [IoDService],
})
export default class IoDModule {}
