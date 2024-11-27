import { Observable } from 'rxjs';

import { SetMetadata, Type } from '@nestjs/common';

import { HeartbeatResponseDto } from '../Heartbeat/interfaces/dto/heartbeat-response.dto';

import { PINGABLE_CLIENT_METADATA_KEY } from './ping.constants';

export type PingableClientMeta = {
  name: string;
};

export interface PingableClientInterface {
  getClientHeartbeat(): Observable<HeartbeatResponseDto>;
}

type TypedClassDecorator<I> = <T extends I>(target: Type<T>) => Type<T>;

export const PingableClient = (
  name: string,
): TypedClassDecorator<PingableClientInterface> =>
  SetMetadata(PINGABLE_CLIENT_METADATA_KEY, { name });
