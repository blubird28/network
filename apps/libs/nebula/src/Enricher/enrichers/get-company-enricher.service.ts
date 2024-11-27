import { Injectable } from '@nestjs/common';

import { LegacyCompanyDto } from '../../dto/legacy-api/legacy-company.dto';
import { ShieldApiService } from '../../Http/ShieldApi/shield-api.service';
import { GenericEnricher } from '../generic-enricher.interface';
import { Enricher } from '../enricher.decorator';

export const GET_COMPANY_ENRICHER_NAME = 'GET_COMPANY';
@Injectable()
@Enricher(GET_COMPANY_ENRICHER_NAME)
export class GetCompanyEnricher
  implements GenericEnricher<[string], LegacyCompanyDto>
{
  constructor(private readonly shieldApiService: ShieldApiService) {}
  enrich(companyId: string): Promise<LegacyCompanyDto> {
    return this.shieldApiService.getCompanyById(companyId);
  }
}
