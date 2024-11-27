import { Injectable } from '@nestjs/common';

import { LegacyMetroDto } from '../../dto/legacy-api/legacy-metro.dto';
import { ShieldApiService } from '../../Http/ShieldApi/shield-api.service';
import { GenericEnricher } from '../generic-enricher.interface';
import { Enricher } from '../enricher.decorator';

export const GET_METRO_BY_ID_ENRICHER_NAME = 'GET_METRO_BY_ID';
@Injectable()
@Enricher(GET_METRO_BY_ID_ENRICHER_NAME)
export class GetMetroByIdEnricher
  implements GenericEnricher<[string], LegacyMetroDto>
{
  constructor(private readonly shieldApiService: ShieldApiService) {}
  enrich(metroId: string): Promise<LegacyMetroDto> {
    return this.shieldApiService.getMetroById(metroId);
  }
}
