import { Expose, Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

import { Fake } from '../../testing/data/fakers';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';

@ExternalType()
@DTOFaker()
export class L1PortAddressDto {
  @Expose()
  @Type(() => String)
  @IsString()
  @IsOptional()
  @Fake('Sample City')
  public readonly city: string;

  @Expose()
  @Type(() => String)
  @IsString()
  @IsOptional()
  @Fake('Sample Address')
  public readonly address: string;

  @Expose()
  @Type(() => String)
  @IsString()
  @IsOptional()
  @Fake('HK')
  public readonly country: string;
}
