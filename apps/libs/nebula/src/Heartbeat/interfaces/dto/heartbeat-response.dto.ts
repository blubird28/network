import { Expose } from 'class-transformer';

import { Fake } from '../../../testing/data/fakers';

export class HeartbeatResponseDto {
  @Fake('@console/some-service')
  @Expose()
  name: string;

  @Fake('1.0.0')
  @Expose()
  version: string;

  @Fake(1655190720737)
  @Expose()
  now: number;

  @Fake(9001000)
  @Expose()
  uptime: number;

  @Fake(9001)
  @Expose()
  uptimeSeconds: number;

  @Fake('Over 9000 seconds')
  @Expose()
  uptimeHuman: string;
}
