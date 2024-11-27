import { Expose, Transform, Type } from 'class-transformer';
import { IsHash, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

import fromMap from '@libs/nebula/utils/data/fromMap';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { FAKE_ATTRIBUTES, FAKE_MD5_HASH } from '../../testing/data/constants';
import { Fake, FakeUuid } from '../../testing/data/fakers';
import { ReferencedByName } from '../../ReferenceBuilder/decorators';
import { ExternalType } from '../../utils/external-type';

@ExternalType()
@ReferencedByName()
@DTOFaker()
export class CreatePriceRequestDto {
  @Fake(FAKE_MD5_HASH)
  @Expose()
  @Type(() => String)
  @IsHash('md5')
  @IsNotEmpty()
  readonly hash: string;

  @Fake('widget_price_final')
  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  readonly priceKey: string;

  @Fake('widget')
  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  readonly product: string;

  @Fake(FAKE_MD5_HASH)
  @Expose()
  @Type(() => String)
  @IsHash('md5')
  @IsNotEmpty()
  readonly timecode: string;

  @FakeUuid
  @Expose()
  @Type(() => String)
  @IsUUID(4)
  @IsNotEmpty()
  readonly checkpointId?: string;

  @Fake(FAKE_ATTRIBUTES)
  @Expose()
  @Type(() => Map)
  @IsOptional()
  @Transform(fromMap, { toClassOnly: true })
  public attributes: Map<string, string | number | boolean>;
}
