import { DeepMocked } from '@golevelup/ts-jest';

import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '../testing/data/fakers';
import { Mocker } from '../testing/mocker/mocker';

import { HeartbeatService } from './heartbeat.service';
import { HeartbeatController } from './heartbeat.controller';
import { HeartbeatResponseDto } from './interfaces/dto/heartbeat-response.dto';

describe('HeartbeatController', () => {
  let controller: HeartbeatController;
  let service: DeepMocked<HeartbeatService>;
  let fake: HeartbeatResponseDto;

  beforeEach(async () => {
    fake = faker(HeartbeatResponseDto);
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HeartbeatController],
    })
      .useMocker(Mocker.service(HeartbeatService))
      .compile();

    controller = module.get<HeartbeatController>(HeartbeatController);
    service = module.get(HeartbeatService);
    service.getHeartbeat.mockReturnValue(fake);
  });

  it('should be defined', () => {
    expect.hasAssertions();

    expect(controller).toBeDefined();
  });

  it('should return expected result', () => {
    expect.hasAssertions();

    expect(controller.getHeartbeat()).toEqual(fake);

    expect(service.getHeartbeat).toHaveBeenCalledTimes(1);
  });
});
