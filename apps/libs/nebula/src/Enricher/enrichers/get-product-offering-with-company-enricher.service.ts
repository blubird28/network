import { Injectable } from '@nestjs/common';

import { LegacyCompanyDto } from '../../dto/legacy-api/legacy-company.dto';
import { ShieldApiService } from '../../Http/ShieldApi/shield-api.service';
import { LegacyMarketplaceProductDto } from '../../dto/legacy-api/legacy-marketplace-product.dto';
import { GenericEnricher } from '../generic-enricher.interface';
import { Enricher } from '../enricher.decorator';

export const GET_PRODUCT_OFFERING_WITH_COMPANY_ENRICHER_NAME =
  'GET_PRODUCT_OFFERING_WITH_COMPANY';

type ProductWithCompany = LegacyMarketplaceProductDto & {
  company: LegacyCompanyDto;
};

@Injectable()
@Enricher(GET_PRODUCT_OFFERING_WITH_COMPANY_ENRICHER_NAME)
export class GetProductOfferingWithCompanyEnricher
  implements GenericEnricher<[string], ProductWithCompany>
{
  constructor(private readonly shieldApiService: ShieldApiService) {}
  async enrich(productOfferingId: string): Promise<ProductWithCompany> {
    const product = await this.shieldApiService.getMarketplaceProductById(
      productOfferingId,
    );
    const company = await this.shieldApiService.getCompanyById(
      product.companyId,
    );
    return { ...product, company };
  }
}
