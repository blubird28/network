import { Expose } from 'class-transformer';

import { DeepFake, Fake } from '../../../testing/data/fakers';
import { HeartbeatResponseDto } from '../../../Heartbeat/interfaces/dto/heartbeat-response.dto';

export class PingDto {
  @Fake(1655359788662)
  @Expose()
  sent: number;

  @Fake(1655359788665)
  @Expose()
  received: number;

  @Fake(3)
  @Expose()
  time: number;
}

export class PongDto extends PingDto {
  @DeepFake(() => HeartbeatResponseDto)
  @Expose()
  data: HeartbeatResponseDto;
}

export class PingResponseDto {
  @DeepFake(() => PingDto)
  @Expose()
  ping: PingDto;

  @DeepFake(() => PongDto)
  @Expose()
  pong: PongDto;

  @Fake(3)
  @Expose()
  totalTime: number;
}
