import { Module } from '@nestjs/common';

import { OdpHttpService } from './odp-http.service';
import { SixconnectHttpService } from './sixconnect-http.service';
import { PrefixLookupHttpService } from './prefix-lookup-http.service';

@Module({
  controllers: [],
  providers: [OdpHttpService, SixconnectHttpService, PrefixLookupHttpService],
  exports: [SixconnectHttpService, PrefixLookupHttpService],
})
export default class OdpModule {}
