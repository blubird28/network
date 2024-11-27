import { Injectable } from '@nestjs/common';

import { ShieldApiService } from '../../Http/ShieldApi/shield-api.service';
import { LegacyMarketplaceProductSpecDto } from '../../dto/legacy-api/legacy-marketplace-productSpec.dto';
import { GenericEnricher } from '../generic-enricher.interface';
import { Enricher } from '../enricher.decorator';

export const GET_PRODUCT_SPECIFICATION_ENRICHER_NAME =
  'GET_PRODUCT_SPECIFICATION';

@Injectable()
@Enricher(GET_PRODUCT_SPECIFICATION_ENRICHER_NAME)
export class GetProductSpecificationEnricher
  implements GenericEnricher<[string], LegacyMarketplaceProductSpecDto>
{
  constructor(private readonly shieldApiService: ShieldApiService) {}
  async enrich(
    productSpecificationId: string,
  ): Promise<LegacyMarketplaceProductSpecDto> {
    return this.shieldApiService.getMarketplaceProductSpecById(
      productSpecificationId,
    );
  }
}
