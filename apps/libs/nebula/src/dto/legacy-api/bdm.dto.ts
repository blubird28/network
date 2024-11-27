import { Expose, Type } from 'class-transformer';
import { IsObject } from 'class-validator';

import { Fake, faker } from '../../testing/data/fakers';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';

import { BdmManagerDto } from './bdm-manager.dto';

@ExternalType()
@DTOFaker()
export class BdmDto {
  @Expose()
  @Type(() => BdmManagerDto)
  @IsObject()
  @Fake(faker(BdmManagerDto))
  public readonly manager: BdmManagerDto;
}
