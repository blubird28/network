import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

import {
  FAKE_ATTRIBUTES,
  FAKE_PRICE_SCHEMA,
} from '@libs/nebula/testing/data/constants';
import fromMap from '@libs/nebula/utils/data/fromMap';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { Fake } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';
@ExternalType()
@DTOFaker()
export class AddonDto {
  @Fake('681e0ff8-4de5-4138-bc34-45dd92e57ea0')
  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  readonly productOfferingId: string;

  @Expose()
  public attributes: Record<string, unknown>;
}
@ExternalType()
@DTOFaker()
export class CalculatePriceDto {
  @Fake('widget_price_final')
  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsNotEmpty()
  readonly priceKey?: string;

  @Fake('widget')
  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsNotEmpty()
  readonly product?: string;

  @Fake(FAKE_ATTRIBUTES)
  @Expose()
  @IsNotEmpty()
  public attributes: Record<string, unknown>;

  @Fake(FAKE_PRICE_SCHEMA)
  @Type(() => Object)
  readonly schema?: object;

  @Fake('6409c399-9a28-4c0f-bada-f78968c53910')
  @Expose()
  @IsOptional()
  @IsNotEmpty()
  @Type(() => String)
  readonly productOfferingId?: string;

  @Expose()
  @Type(() => AddonDto)
  @IsOptional()
  public addons?: AddonDto[];
}
