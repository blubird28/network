import { Type } from 'class-transformer';

import StringProp, { MongoIDProp } from '../decorators/StringProp.decorator';
import ArrayProp, { StringArrayProp } from '../decorators/ArrayProp.decorator';
import { DeepFakeMany } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';

import { PolicyStatementDto } from './policy-statement.dto';

@ExternalType()
@DTOFaker()
export class PolicyDto {
  @MongoIDProp()
  public readonly mongoId: string;

  @StringProp({ fake: 'Policy description' })
  public readonly description: string;

  @StringProp({ fake: 'Policy name' })
  public readonly name: string;

  @StringArrayProp({ fake: [] })
  public readonly tags: string[];

  @DeepFakeMany(() => PolicyStatementDto, {})
  @ArrayProp()
  @Type(() => PolicyStatementDto)
  public readonly statements: PolicyStatementDto[];

  @StringProp({ fake: '2018-03-01' })
  public readonly version: string;
}
