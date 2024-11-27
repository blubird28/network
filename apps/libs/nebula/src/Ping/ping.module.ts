import { DiscoveryModule } from '@golevelup/nestjs-discovery';

import { Module } from '@nestjs/common';

import { PingController } from './ping.controller';
import { PingService } from './ping.service';

@Module({
  controllers: [PingController],
  providers: [PingService],
  imports: [DiscoveryModule],
})
export class PingModule {}
