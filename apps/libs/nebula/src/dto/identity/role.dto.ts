import { Type } from 'class-transformer';

import StringProp, { MongoIDProp } from '../decorators/StringProp.decorator';
import ArrayProp from '../decorators/ArrayProp.decorator';
import { DeepFakeMany } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';

import { PolicyDto } from './policy.dto';

@ExternalType()
@DTOFaker()
export class RoleDto {
  @MongoIDProp()
  public readonly mongoId: string;

  @StringProp({ fake: 'ROLE' })
  public readonly name: string;

  @StringProp({ fake: 'Role' })
  public readonly display: string;

  @DeepFakeMany(() => PolicyDto, {})
  @ArrayProp()
  @Type(() => PolicyDto)
  public readonly policies: PolicyDto[];
}
