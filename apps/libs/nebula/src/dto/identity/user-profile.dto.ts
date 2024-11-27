import { MaxLength } from 'class-validator';
import { Expose, Type } from 'class-transformer';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { JOE_BLOGGS_NAME } from '../../testing/data/constants';
import { Fake } from '../../testing/data/fakers';
import { ReferencedByName } from '../../ReferenceBuilder/decorators';
import { ExternalType } from '../../utils/external-type';

@ExternalType()
@ReferencedByName()
@DTOFaker()
export class UserProfileDto {
  @Fake(JOE_BLOGGS_NAME)
  @Expose()
  @MaxLength(120)
  @Type(() => String)
  readonly name: string;

  @Fake('Breaking News! Man bites dog')
  @Expose()
  @MaxLength(120)
  @Type(() => String)
  readonly headline: string;

  @Fake('A short description')
  @Expose()
  @MaxLength(550)
  @Type(() => String)
  readonly summary: string;
}
