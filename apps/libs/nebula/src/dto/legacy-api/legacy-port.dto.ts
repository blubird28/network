import { Expose, Type } from 'class-transformer';
import { Allow } from 'class-validator';

import { DeepFake } from '@libs/nebula/testing/data/fakers';

import { ReferencedById } from '../../ReferenceBuilder/decorators';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';
import { MongoIDProp } from '../decorators/StringProp.decorator';

import { LegacyDCFDto } from './legacy-dcf.dto';

@ExternalType()
@ReferencedById()
@DTOFaker()
export class LegacyPortDto {
  @MongoIDProp()
  public readonly id: string;

  @DeepFake(() => LegacyDCFDto)
  @Expose()
  @Type(() => LegacyDCFDto)
  @Allow()
  public readonly dcf: LegacyDCFDto;
}
