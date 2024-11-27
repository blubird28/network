import { Test, TestingModule } from '@nestjs/testing';

import { setAfter } from '../testing/data/fakers/helpers';
import { Mocker } from '../testing/mocker/mocker';
import { faker } from '../testing/data/fakers';

import { HeartbeatService } from './heartbeat.service';
import { HeartbeatResponseDto } from './interfaces/dto/heartbeat-response.dto';

describe('HeartbeatService', () => {
  let service: HeartbeatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeartbeatService],
    })
      .useMocker(
        Mocker.config({
          APP_NAME: 'some-app',
        }),
      )
      .compile();

    service = module.get<HeartbeatService>(HeartbeatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return expected results', () => {
    const result = service.getHeartbeat();
    expect(result).toStrictEqual<HeartbeatResponseDto>(
      faker(
        HeartbeatResponseDto,
        { name: 'some-app' },
        {
          postProcess: setAfter({
            now: expect.any(Number),
            uptime: expect.any(Number),
            uptimeHuman: expect.any(String),
            uptimeSeconds: expect.any(Number),
            version: expect.any(String),
          }),
        },
      ),
    );
  });
});
