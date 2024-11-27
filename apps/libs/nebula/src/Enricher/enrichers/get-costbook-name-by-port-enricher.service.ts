import { Injectable } from '@nestjs/common';

import { ShieldApiService } from '../../Http/ShieldApi/shield-api.service';
import { GenericEnricher } from '../generic-enricher.interface';
import { Enricher } from '../enricher.decorator';

export const GET_COSTBOOK_NAME_BY_PORT_ENRICHER_NAME =
  'GET_COSTBOOK_NAME_BY_PORT';
@Injectable()
@Enricher(GET_COSTBOOK_NAME_BY_PORT_ENRICHER_NAME)
export class GetCostbookNameByPortEnricher
  implements GenericEnricher<[string], string>
{
  constructor(private readonly shieldApiService: ShieldApiService) {}
  async enrich(portId: string): Promise<string> {
    const costbook = await this.shieldApiService.getCostbookLocationByPortId(
      portId,
    );
    return costbook?.name;
  }
}
