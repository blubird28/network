import { Module } from '@nestjs/common';

import { PricingConfigService } from '../Config/schemas/pricing-service.schema';
import { PricingHttpService } from '../Http/Pricing/pricing-http.service';

@Module({
  imports: [PricingConfigService],
  providers: [PricingHttpService],
  exports: [PricingHttpService],
})
export class PricingServiceModule {}
