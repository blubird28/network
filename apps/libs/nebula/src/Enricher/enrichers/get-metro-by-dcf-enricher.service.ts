import { Injectable } from '@nestjs/common';

import { LegacyMetroDto } from '@libs/nebula/dto/legacy-api/legacy-metro.dto';

import { ShieldApiService } from '../../Http/ShieldApi/shield-api.service';
import { GenericEnricher } from '../generic-enricher.interface';
import { Enricher } from '../enricher.decorator';

export const GET_METRO_BY_DCF_ENRICHER_NAME = 'GET_METRO_BY_DCF';
@Injectable()
@Enricher(GET_METRO_BY_DCF_ENRICHER_NAME)
export class GetMetroByDCFEnricher
  implements GenericEnricher<[string], LegacyMetroDto>
{
  constructor(private readonly shieldApiService: ShieldApiService) {}
  enrich(dcfId: string): Promise<LegacyMetroDto> {
    return this.shieldApiService.getMetroByDcfId(dcfId);
  }
}
