import { Expose, Type } from 'class-transformer';
import { Allow } from 'class-validator';

import { DeepFake } from '@libs/nebula/testing/data/fakers';

import { ReferencedById } from '../../ReferenceBuilder/decorators';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';
import { MongoIDProp } from '../decorators/StringProp.decorator';

import { LegacyCompanyDetailsDto } from './legacy-company-details.dto';

@ExternalType()
@ReferencedById()
@DTOFaker()
export class LegacyDCFDto {
  @MongoIDProp()
  public readonly id: string;

  @DeepFake(() => LegacyCompanyDetailsDto)
  @Expose()
  @Type(() => LegacyCompanyDetailsDto)
  @Allow()
  public readonly company: LegacyCompanyDetailsDto;
}
