import { Module } from '@nestjs/common';

import { ShieldApiService } from './shield-api.service';

@Module({
  providers: [ShieldApiService],
  exports: [ShieldApiService],
})
export class ShieldApiModule {}
