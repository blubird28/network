import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

import { Public } from '../auth/public.decorator';
import { NoPBAC } from '../auth/no-pbac.decorator';

import { HeartbeatResponseDto } from './interfaces/dto/heartbeat-response.dto';
import { HeartbeatService } from './heartbeat.service';
import { MESSAGE_PATTERN_HEARTBEAT } from './heartbeat.constants';

@ApiTags('health')
@Controller('heartbeat')
export class HeartbeatController {
  constructor(private readonly heartbeatService: HeartbeatService) {}

  @Get()
  @MessagePattern(MESSAGE_PATTERN_HEARTBEAT)
  @Public()
  @NoPBAC()
  @SkipThrottle()
  getHeartbeat(): HeartbeatResponseDto {
    return this.heartbeatService.getHeartbeat();
  }
}
