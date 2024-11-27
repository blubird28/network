import { Test, TestingModule } from '@nestjs/testing';

import { MockerBuilder } from '../testing/mocker/mocker.builder';
import { Mocker } from '../testing/mocker/mocker';

import { HeartbeatService } from './heartbeat.service';
import { HeartbeatModule } from './heartbeat.module';
import { HeartbeatController } from './heartbeat.controller';

describe('HeartbeatModule', () => {
  let service: HeartbeatService;
  let controller: HeartbeatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HeartbeatModule],
    })
      .useMocker(
        new Mocker(
          MockerBuilder.mockConfig({
            APP_NAME: 'some-app',
          }),
        ).mock(),
      )
      .compile();

    service = module.get<HeartbeatService>(HeartbeatService);
    controller = module.get<HeartbeatController>(HeartbeatController);
  });

  it('should instantiate the service and controller', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });
});
