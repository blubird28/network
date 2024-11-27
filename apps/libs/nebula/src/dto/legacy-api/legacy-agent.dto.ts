import { StringArrayProp } from '@libs/nebula/dto/decorators/ArrayProp.decorator';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import {
  FAKE_OBJECT_ID,
  JOE_BLOGGS_EMAIL,
  JOE_BLOGGS_HEADLINE,
  JOE_BLOGGS_NAME,
  JOE_BLOGGS_USERNAME,
} from '../../testing/data/constants';
import { ReferencedById } from '../../ReferenceBuilder/decorators';
import { ExternalType } from '../../utils/external-type';
import StringProp, { MongoIDProp } from '../decorators/StringProp.decorator';
import BooleanProp from '../decorators/BooleanProp.decorator';
import DateProp from '../decorators/DateProp.decorator';

@ExternalType()
@ReferencedById()
@DTOFaker()
export class LegacyAgentDto {
  @StringProp({ fake: JOE_BLOGGS_EMAIL })
  public readonly email: string;

  @StringProp({ fake: JOE_BLOGGS_HEADLINE, optional: true })
  public readonly headline?: string = '';

  @MongoIDProp()
  public readonly id: string;

  @StringProp({ fake: JOE_BLOGGS_NAME, optional: true })
  public readonly name: string = '';

  @StringProp({
    fake: JOE_BLOGGS_USERNAME,
  })
  public readonly username: string;

  @DateProp({
    optional: true,
  })
  public readonly lastLoggedIn: Date;

  @DateProp({
    optional: true,
  })
  public readonly lastSeenAt: Date;

  @DateProp({
    optional: true,
  })
  public readonly createdAt: Date;

  @DateProp({
    optional: true,
  })
  public readonly updatedAt: Date;

  @DateProp({
    optional: true,
    fake: null,
  })
  public readonly deletedAt: Date;

  @DateProp({
    optional: true,
  })
  public readonly passwordUpdatedAt: Date;

  @StringProp({ fake: 'A short description', optional: true })
  public readonly summary: string = '';

  @StringProp({ fake: 'PERSON', optional: true })
  public readonly type: string = 'PERSON';

  @BooleanProp({ fake: false, optional: true })
  public readonly isServiceAccount: boolean = false;

  @StringArrayProp({ fake: [FAKE_OBJECT_ID] })
  public readonly policyIds: string[] = [];

  @StringArrayProp({ fake: [FAKE_OBJECT_ID] })
  public readonly accessRoleIds: string[] = [];

  @StringProp({ fake: JOE_BLOGGS_USERNAME, optional: true })
  public readonly ldapId?: string;
}
