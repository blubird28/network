import { catchError, forkJoin, from, map, Observable } from 'rxjs';
import { DiscoveryService } from '@golevelup/nestjs-discovery';

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { HeartbeatResponseDto } from '../Heartbeat/interfaces/dto/heartbeat-response.dto';

import { PingableClientInterface, PingableClientMeta } from './ping.decorators';
import { PingResponseDto } from './interfaces/dto/ping.dto';
import { PING_FAILED, PINGABLE_CLIENT_METADATA_KEY } from './ping.constants';

@Injectable()
export class PingService implements OnModuleInit {
  private readonly logger = new Logger(PingService.name);
  private clients: Record<string, PingableClientInterface> = {};
  constructor(
    private readonly discover: DiscoveryService,
    private readonly moduleRef: ModuleRef,
  ) {}

  async onModuleInit() {
    this.logger.log('Discovering pingable clients...');
    const providers =
      await this.discover.providersWithMetaAtKey<PingableClientMeta>(
        PINGABLE_CLIENT_METADATA_KEY,
      );

    this.logger.log(`${providers.length} pingable clients found`);

    providers.forEach(({ meta: { name }, discoveredClass }) => {
      this.clients[name] = this.moduleRef.get<PingableClientInterface>(
        discoveredClass.dependencyType,
        {
          strict: false,
        },
      );
    });
  }

  mapPongResponse(
    pingSent: number,
    pong: HeartbeatResponseDto,
  ): PingResponseDto {
    const pongReceived = Date.now();
    const pongSent = pong.now;
    const totalTime = pongReceived - pingSent;
    const response: PingResponseDto = {
      ping: {
        sent: pingSent,
        received: pongSent,
        time: pongSent - pingSent,
      },
      pong: {
        data: pong,
        sent: pongSent,
        received: pongReceived,
        time: pongReceived - pongSent,
      },
      totalTime,
    };
    this.logger.log({ msg: 'Pong received', ...response });
    return response;
  }

  pingOneClient(client: PingableClientInterface): Observable<PingResponseDto> {
    const pingSent = Date.now();
    this.logger.log('Sending ping');

    return client
      .getClientHeartbeat()
      .pipe(
        map((pong: HeartbeatResponseDto) =>
          this.mapPongResponse(pingSent, pong),
        ),
      );
  }

  pingOneClientByName(clientName: string): Observable<PingResponseDto> {
    this.logger.log({ msg: 'Attempting to ping client by name', clientName });
    const client = this.clients[clientName];
    if (!client) {
      this.logger.error(
        `Failed to find client by name (${clientName}) when attempting to ping. Check that it was properly marked with a PingableClient decoration`,
      );
      throw new Error(
        `No client found by name: ${clientName} when trying to ping`,
      );
    }
    return this.pingOneClient(client);
  }

  pingAllClients(): Observable<Record<string, PingResponseDto | string>> {
    this.logger.log('Attempting to ping all registered clients');
    const clients = Object.entries(this.clients);
    if (clients.length === 0) {
      this.logger.log('No clients to ping');
      return from([{}]);
    }
    return forkJoin(
      Object.fromEntries(
        Object.entries(this.clients).map(([clientName, client]) => [
          clientName,
          this.pingOneClient(client).pipe(catchError(() => [PING_FAILED])),
        ]),
      ),
    );
  }
}
