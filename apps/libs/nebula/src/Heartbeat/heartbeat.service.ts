import moment from 'moment';
import readPackageUp, { NormalizedPackageJson } from 'read-pkg-up';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import toDto from '@libs/nebula/utils/data/toDto';

import { BaseConfig } from '../Config/schemas/base.schema';

import { HeartbeatResponseDto } from './interfaces/dto/heartbeat-response.dto';

@Injectable()
export class HeartbeatService {
  private readonly packageJson: NormalizedPackageJson;
  private readonly startTime: number;
  constructor(private configService: ConfigService<BaseConfig>) {
    this.packageJson = readPackageUp.sync().packageJson;
    this.startTime = Date.now();
  }

  getHeartbeat(): HeartbeatResponseDto {
    const now = Date.now();
    const name = this.configService.get('APP_NAME');
    const uptime = now - this.startTime;
    const { version } = this.packageJson;
    const uptimeSeconds = Math.round(uptime / 1000);
    const uptimeHuman = moment(this.startTime).fromNow();
    return toDto(
      {
        now,
        name,
        uptime,
        uptimeHuman,
        uptimeSeconds,
        version,
      },
      HeartbeatResponseDto,
    );
  }
}
