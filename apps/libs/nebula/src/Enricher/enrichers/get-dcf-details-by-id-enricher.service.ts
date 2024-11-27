import { Injectable } from '@nestjs/common';

import { LegacyDCFDto } from '@libs/nebula/dto/legacy-api/legacy-dcf.dto';

import { ShieldApiService } from '../../Http/ShieldApi/shield-api.service';
import { Enricher } from '../enricher.decorator';
import { GenericEnricher } from '../generic-enricher.interface';

export const GET_DCF_BY_ID = 'GET_DCF_BY_ID';
@Injectable()
@Enricher(GET_DCF_BY_ID)
export class GetDcfDetailsByIdEnricher
  implements GenericEnricher<[string], LegacyDCFDto>
{
  constructor(private readonly shieldApiService: ShieldApiService) {}
  async enrich(id: string): Promise<LegacyDCFDto> {
    return this.shieldApiService.getDetailsByDcfId(id);
  }
}
