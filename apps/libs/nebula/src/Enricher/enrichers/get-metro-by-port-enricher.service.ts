import { Injectable } from '@nestjs/common';

import { LegacyMetroDto } from '@libs/nebula/dto/legacy-api/legacy-metro.dto';

import { ShieldApiService } from '../../Http/ShieldApi/shield-api.service';
import { GenericEnricher } from '../generic-enricher.interface';
import { Enricher } from '../enricher.decorator';

export const GET_METRO_BY_PORT_ENRICHER_NAME = 'GET_METRO_BY_PORT';
@Injectable()
@Enricher(GET_METRO_BY_PORT_ENRICHER_NAME)
export class GetMetroByPortEnricher
  implements GenericEnricher<[string], LegacyMetroDto>
{
  constructor(private readonly shieldApiService: ShieldApiService) {}
  enrich(portId: string): Promise<LegacyMetroDto> {
    return this.shieldApiService.getMetroByPortId(portId);
  }
}
