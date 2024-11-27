import { Injectable } from '@nestjs/common';

import { BdmDto } from '@libs/nebula/dto/legacy-api/bdm.dto';

import { ShieldApiService } from '../../Http/ShieldApi/shield-api.service';
import { Enricher } from '../enricher.decorator';
import { GenericEnricher } from '../generic-enricher.interface';

export const BDM_BY_COMPANY_ID_ENRICHER_NAME = 'BDM_BY_COMPANY_ID';
@Injectable()
@Enricher(BDM_BY_COMPANY_ID_ENRICHER_NAME)
export class GetBdmByCompanyIdEnricher
  implements GenericEnricher<[string], BdmDto>
{
  constructor(private readonly shieldApiService: ShieldApiService) {}
  async enrich(companyId: string): Promise<BdmDto> {
    return this.shieldApiService.getBdm(companyId);
  }
}
