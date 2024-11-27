import { Injectable } from '@nestjs/common';

import { ShieldProductDetailsDto } from '@libs/nebula/dto/legacy-api/shield-product-details.dto';

import { ShieldApiService } from '../../Http/ShieldApi/shield-api.service';
import { Enricher } from '../enricher.decorator';
import { GenericEnricher } from '../generic-enricher.interface';

export const GET_SHIELD_PRODUCT_DETAILS = 'GET_SHIELD_PRODUCT_DETAILS';
@Injectable()
@Enricher(GET_SHIELD_PRODUCT_DETAILS)
export class GetShieldProductDetailsEnricher
  implements GenericEnricher<[string], ShieldProductDetailsDto>
{
  constructor(private readonly shieldApiService: ShieldApiService) {}
  async enrich(id: string): Promise<ShieldProductDetailsDto> {
    return this.shieldApiService.getProductDetails(id);
  }
}
