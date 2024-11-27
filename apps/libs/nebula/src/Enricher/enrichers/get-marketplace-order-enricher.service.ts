import { Injectable } from '@nestjs/common';

import { ShieldApiService } from '../../Http/ShieldApi/shield-api.service';
import { MarketplaceOrderDto } from '../../dto/legacy-api/marketplace-order.dto';
import { GenericEnricher } from '../generic-enricher.interface';
import { Enricher } from '../enricher.decorator';

export const GET_MARKETPLACE_ORDER_ENRICHER_NAME = 'GET_MARKETPLACE_ORDER';
@Injectable()
@Enricher(GET_MARKETPLACE_ORDER_ENRICHER_NAME)
export class GetMarketplaceOrderEnricher
  implements GenericEnricher<[string], MarketplaceOrderDto>
{
  constructor(private readonly shieldApiService: ShieldApiService) {}
  enrich(orderId: string): Promise<MarketplaceOrderDto> {
    return this.shieldApiService.getMarketplaceOrderById(orderId);
  }
}
