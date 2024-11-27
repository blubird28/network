import { lastValueFrom, of } from 'rxjs';
import { createMock } from '@golevelup/ts-jest';

import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '../testing/data/fakers';

import { PingResponseDto } from './interfaces/dto/ping.dto';
import { PingService } from './ping.service';
import { PingController } from './ping.controller';

describe('PingControllerTcp', () => {
  let controller: PingController;
  let service: PingService;
  const pingResponse = faker(PingResponseDto);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PingController],
      providers: [
        {
          provide: PingService,
          useValue: createMock<PingService>({
            pingAllClients: () => of({ SERVICE_PLEASE: pingResponse }),
            pingOneClientByName: () => of(pingResponse),
          }),
        },
      ],
    }).compile();

    controller = module.get<PingController>(PingController);
    service = module.get<PingService>(PingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should ping a single client', async () => {
    expect.hasAssertions();

    expect(
      await lastValueFrom(controller.sendPingHttp('SERVICE_PLEASE')),
    ).toStrictEqual(pingResponse);

    expect(service.pingOneClientByName).toBeCalledWith('SERVICE_PLEASE');
  });

  it('should ping all clients', async () => {
    expect.hasAssertions();

    expect(await lastValueFrom(controller.sendAllPingsHttp())).toStrictEqual({
      SERVICE_PLEASE: pingResponse,
    });

    expect(service.pingAllClients).toHaveBeenCalledTimes(1);
  });
});
