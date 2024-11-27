import { Injectable } from '@nestjs/common';

import { ShieldApiService } from '../../Http/ShieldApi/shield-api.service';
import { GenericEnricher } from '../generic-enricher.interface';
import { Enricher } from '../enricher.decorator';

export const GET_COSTBOOK_NAME_BY_DCF_ENRICHER_NAME =
  'GET_COSTBOOK_NAME_BY_DCF';
@Injectable()
@Enricher(GET_COSTBOOK_NAME_BY_DCF_ENRICHER_NAME)
export class GetCostbookNameByDCFEnricher
  implements GenericEnricher<[string], string>
{
  constructor(private readonly shieldApiService: ShieldApiService) {}
  async enrich(dcfId: string): Promise<string> {
    const costbook = await this.shieldApiService.getCostbookLocationByDcfId(
      dcfId,
    );
    return costbook?.name;
  }
}
