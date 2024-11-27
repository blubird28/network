import { Expose, Type } from 'class-transformer';
import { Allow } from 'class-validator';

import DateProp from '../decorators/DateProp.decorator';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { DeepFake, Fake, FakeObjectId } from '../../testing/data/fakers';
import { ReferencedById } from '../../ReferenceBuilder/decorators';
import { ExternalType } from '../../utils/external-type';

import { LegacyPolicyDefinition } from './legacy-policy-definition.dto';

@ExternalType()
@ReferencedById()
@DTOFaker()
export class LegacyPolicyDto {
  @FakeObjectId
  @Type(() => String)
  @Expose()
  @Allow()
  public readonly id: string;

  @DeepFake(() => LegacyPolicyDefinition)
  @Expose()
  @Type(() => LegacyPolicyDefinition)
  @Allow()
  public readonly definition: LegacyPolicyDefinition;

  @Fake('Policy description')
  @Expose()
  @Type(() => String)
  @Allow()
  public readonly description: string;

  @Fake('Policy name')
  @Expose()
  @Type(() => String)
  @Allow()
  public readonly name: string;

  @Fake([])
  @Expose()
  @Type(() => String)
  @Allow()
  public readonly tags: string[];

  @DateProp({ optional: true, fake: null })
  public readonly deletedAt?: Date;
}
