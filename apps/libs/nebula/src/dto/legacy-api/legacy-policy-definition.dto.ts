import { Expose, Type } from 'class-transformer';
import { Allow } from 'class-validator';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { DeepFakeMany, Fake } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';

import { LegacyPolicyStatement } from './legacy-policy-statement.dto';

@ExternalType()
@DTOFaker()
export class LegacyPolicyDefinition {
  @DeepFakeMany(() => LegacyPolicyStatement, {})
  @Expose()
  @Type(() => LegacyPolicyStatement)
  @Allow()
  public readonly Statement: LegacyPolicyStatement[];

  @Fake('2018-03-01')
  @Expose()
  @Type(() => String)
  @Allow()
  public readonly Version: string;
}
