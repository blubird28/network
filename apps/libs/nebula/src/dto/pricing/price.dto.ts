import { IntersectionType } from '@nestjs/mapped-types';

import { IntersectionFaker } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';

import { PriceIdDto } from './price-id.dto';
import { BasePriceResponseDto } from './price-response.dto';
import { PriceRequestIdentifierDto } from './price-request-identifier.dto';

@ExternalType<PriceIdDto & PriceRequestIdentifierDto & BasePriceResponseDto>()
@IntersectionFaker(PriceIdDto, PriceRequestIdentifierDto, BasePriceResponseDto)
export class PriceDto extends IntersectionType(
  PriceIdDto,
  PriceRequestIdentifierDto,
  BasePriceResponseDto,
) {}
