import { Injectable } from '@nestjs/common';

import { LegacyPortDto } from '@libs/nebula/dto/legacy-api/legacy-port.dto';

import { ShieldApiService } from '../../Http/ShieldApi/shield-api.service';
import { Enricher } from '../enricher.decorator';
import { GenericEnricher } from '../generic-enricher.interface';

export const GET_PORT_BY_ID = 'GET_PORT_BY_ID';
@Injectable()
@Enricher(GET_PORT_BY_ID)
export class GetPortDetailsByIdEnricher
  implements GenericEnricher<[string], LegacyPortDto>
{
  constructor(private readonly shieldApiService: ShieldApiService) {}
  async enrich(id: string): Promise<LegacyPortDto> {
    return this.shieldApiService.getDetailsByPortId(id);
  }
}
