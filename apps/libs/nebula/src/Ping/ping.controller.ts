import { Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PingService } from './ping.service';

@ApiTags('health')
@Controller('ping')
export class PingController {
  constructor(private pingService: PingService) {}

  @Post()
  sendAllPingsHttp() {
    return this.pingService.pingAllClients();
  }

  @Post(':clientName')
  sendPingHttp(@Param('clientName') clientName: string) {
    return this.pingService.pingOneClientByName(clientName);
  }
}
