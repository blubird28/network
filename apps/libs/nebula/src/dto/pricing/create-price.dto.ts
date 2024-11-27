import { IntersectionType } from '@nestjs/mapped-types';

import { IntersectionFaker } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';

import { PriceResponseDto } from './price-response.dto';
import { PriceRequestIdentifierDto } from './price-request-identifier.dto';

@ExternalType<PriceRequestIdentifierDto & PriceResponseDto>()
@IntersectionFaker(PriceRequestIdentifierDto, PriceResponseDto)
export class CreatePriceDto extends IntersectionType(
  PriceRequestIdentifierDto,
  PriceResponseDto,
) {}
