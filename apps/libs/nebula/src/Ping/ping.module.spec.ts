import { Test, TestingModule } from '@nestjs/testing';

import { PingModule } from './ping.module';
import { PingController } from './ping.controller';
import { PingService } from './ping.service';

describe('PingModule', () => {
  let controller: PingController;
  let service: PingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PingModule],
    }).compile();

    controller = module.get<PingController>(PingController);
    service = module.get<PingService>(PingService);
  });

  it('should instantiate the controller and service', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
