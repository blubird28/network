import { IntersectionType } from '@nestjs/mapped-types';

import { IntersectionFaker } from '../../testing/data/fakers';
import { ReferencedByUserId } from '../../ReferenceBuilder/decorators';
import { ExternalType } from '../../utils/external-type';
import { PriceRequestIdDto } from '../price-request-id.dto';

import { CreatePriceRequestDto } from './create-price-request.dto';

@ExternalType<PriceRequestIdDto & CreatePriceRequestDto>()
@ReferencedByUserId()
@IntersectionFaker(PriceRequestIdDto, CreatePriceRequestDto)
export class PriceRequestDto extends IntersectionType(
  PriceRequestIdDto,
  CreatePriceRequestDto,
) {}
