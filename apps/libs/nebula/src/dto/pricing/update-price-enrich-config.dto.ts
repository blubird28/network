import { PartialType } from '@nestjs/swagger';

import { ExternalType } from '../../utils/external-type';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { IntersectionFaker } from '../../testing/data/fakers';

import { CreatePriceEnrichConfigDto } from './create-price-enrich-config.dto';

@ExternalType()
@DTOFaker()
@IntersectionFaker(CreatePriceEnrichConfigDto)
export class UpdatePriceEnrichConfigDto extends PartialType(
  CreatePriceEnrichConfigDto,
) {}
