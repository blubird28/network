import { lastValueFrom, Observable, of, throwError } from 'rxjs';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';

import { Test, TestingModule } from '@nestjs/testing';

import { HeartbeatResponseDto } from '../Heartbeat/interfaces/dto/heartbeat-response.dto';
import { faker } from '../testing/data/fakers';

import { PingService } from './ping.service';
import { PingableClient, PingableClientInterface } from './ping.decorators';
import { PING_FAILED } from './ping.constants';

describe('PingService', () => {
  let service: PingService;
  let clients;
  const getPingableClient = (
    name: string,
    get: () => Observable<HeartbeatResponseDto>,
  ) => {
    @PingableClient(name)
    class Client implements PingableClientInterface {
      readonly getRef = jest.fn(get);
      getClientHeartbeat(): Observable<HeartbeatResponseDto> {
        return this.getRef();
      }
    }

    return Client;
  };

  beforeEach(async () => {
    const A = getPingableClient('SERVICE_A', () =>
      of(faker(HeartbeatResponseDto, { now: 900 })),
    );
    const B = getPingableClient('SERVICE_B', () =>
      of(faker(HeartbeatResponseDto, { now: 950 })),
    );
    const C = getPingableClient('SERVICE_C', () => {
      jest.setSystemTime(1000);
      return of(faker(HeartbeatResponseDto, { now: 980 }));
    });
    const module: TestingModule = await Test.createTestingModule({
      providers: [PingService, A, B, C],
      imports: [DiscoveryModule],
    }).compile();

    service = module.get<PingService>(PingService);
    clients = {
      SERVICE_A: module.get<PingableClientInterface>(A),
      SERVICE_B: module.get<PingableClientInterface>(B),
      SERVICE_C: module.get<PingableClientInterface>(C),
    };

    await service.onModuleInit();
    jest.useFakeTimers();
    jest.setSystemTime(800);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should derive the correct ping response DTO given the ping and pong times', () => {
    expect(
      service.mapPongResponse(600, faker(HeartbeatResponseDto, { now: 700 })),
    ).toStrictEqual({
      ping: {
        received: 700,
        sent: 600,
        time: 100,
      },
      pong: {
        data: faker(HeartbeatResponseDto, { now: 700 }),
        received: 800,
        sent: 700,
        time: 100,
      },
      totalTime: 200,
    });
  });

  it('should ping a single client directly', async () => {
    const result = await lastValueFrom(
      service.pingOneClient(clients.SERVICE_C),
    );
    expect(result).toStrictEqual({
      ping: {
        received: 980,
        sent: 800,
        time: 180,
      },
      pong: {
        data: faker(HeartbeatResponseDto, { now: 980 }),
        received: 1000,
        sent: 980,
        time: 20,
      },
      totalTime: 200,
    });

    expect(clients.SERVICE_C.getRef).toHaveBeenCalledTimes(1);
  });

  it('should ping a single client by name', async () => {
    const result = await lastValueFrom(
      service.pingOneClientByName('SERVICE_C'),
    );
    expect(result).toStrictEqual({
      ping: {
        received: 980,
        sent: 800,
        time: 180,
      },
      pong: {
        data: faker(HeartbeatResponseDto, { now: 980 }),
        received: 1000,
        sent: 980,
        time: 20,
      },
      totalTime: 200,
    });

    expect(clients.SERVICE_C.getRef).toHaveBeenCalledTimes(1);
  });

  it('should fail to ping an unconfigured client', () => {
    expect(() => service.pingOneClientByName('SERVICE_PLEASE')).toThrow(
      'No client found by name: SERVICE_PLEASE when trying to ping',
    );
  });

  it('should ping all clients', async () => {
    const result = await lastValueFrom(service.pingAllClients());
    expect(result).toStrictEqual({
      SERVICE_A: {
        ping: {
          received: 900,
          sent: 800,
          time: 100,
        },
        pong: {
          data: faker(HeartbeatResponseDto, { now: 900 }),
          received: 1000,
          sent: 900,
          time: 100,
        },
        totalTime: 200,
      },
      SERVICE_B: {
        ping: {
          received: 950,
          sent: 800,
          time: 150,
        },
        pong: {
          data: faker(HeartbeatResponseDto, { now: 950 }),
          received: 1000,
          sent: 950,
          time: 50,
        },
        totalTime: 200,
      },
      SERVICE_C: {
        ping: {
          received: 980,
          sent: 800,
          time: 180,
        },
        pong: {
          data: faker(HeartbeatResponseDto, { now: 980 }),
          received: 1000,
          sent: 980,
          time: 20,
        },
        totalTime: 200,
      },
    });

    expect(clients.SERVICE_A.getRef).toHaveBeenCalledTimes(1);
    expect(clients.SERVICE_B.getRef).toHaveBeenCalledTimes(1);
    expect(clients.SERVICE_C.getRef).toHaveBeenCalledTimes(1);
  });

  it('handles partial failure', async () => {
    clients.SERVICE_B.getRef.mockReturnValue(
      throwError(() => new Error('computer says no')),
    );
    const result = await lastValueFrom(service.pingAllClients());
    expect(result).toStrictEqual({
      SERVICE_A: {
        ping: {
          received: 900,
          sent: 800,
          time: 100,
        },
        pong: {
          data: faker(HeartbeatResponseDto, { now: 900 }),
          received: 1000,
          sent: 900,
          time: 100,
        },
        totalTime: 200,
      },
      SERVICE_B: PING_FAILED,
      SERVICE_C: {
        ping: {
          received: 980,
          sent: 800,
          time: 180,
        },
        pong: {
          data: faker(HeartbeatResponseDto, { now: 980 }),
          received: 1000,
          sent: 980,
          time: 20,
        },
        totalTime: 200,
      },
    });

    expect(clients.SERVICE_A.getRef).toHaveBeenCalledTimes(1);
    expect(clients.SERVICE_B.getRef).toHaveBeenCalledTimes(1);
    expect(clients.SERVICE_C.getRef).toHaveBeenCalledTimes(1);
  });
});
