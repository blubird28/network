import { Module } from '@nestjs/common';

import { ServiceLayerHttpService } from './service-layer-http.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ServiceLayerHttpService],
  exports: [ServiceLayerHttpService],
})
export default class ServiceLayerModule {}
