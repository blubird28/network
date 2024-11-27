import { Injectable } from '@nestjs/common';

import { L1OrderDto } from '@libs/nebula/dto/legacy-api/l1-order.dto';

import { ShieldApiService } from '../../Http/ShieldApi/shield-api.service';
import { Enricher } from '../enricher.decorator';
import { GenericEnricher } from '../generic-enricher.interface';

export const L1_ORDER_BY_ID_ENRICHER_NAME = 'L1_ORDER_BY_ID';
@Injectable()
@Enricher(L1_ORDER_BY_ID_ENRICHER_NAME)
export class GetL1OrderByIdEnricher
  implements GenericEnricher<[string], L1OrderDto>
{
  constructor(private readonly shieldApiService: ShieldApiService) {}
  async enrich(orderId: string): Promise<L1OrderDto> {
    return this.shieldApiService.getL1OrderById(orderId);
  }
}
