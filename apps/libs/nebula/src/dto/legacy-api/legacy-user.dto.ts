import splitFullName from '@libs/nebula/utils/data/splitFullName';
import { CRMUser } from '@libs/nebula/dto/crm-sync/user/crm-user.interface';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import {
  FAKE_SALT,
  FAKE_HASH,
  JOE_BLOGGS_EMAIL,
  JOE_BLOGGS_NAME,
  JOE_BLOGGS_HEADLINE,
  JOE_BLOGGS_PHONE,
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
export class LegacyUserDto {
  @StringProp({ fake: JOE_BLOGGS_EMAIL })
  public readonly email: string;

  @StringProp({ fake: JOE_BLOGGS_HEADLINE, optional: true })
  public readonly headline?: string = '';

  @MongoIDProp()
  public readonly id: string;

  @StringProp({ fake: JOE_BLOGGS_NAME, optional: true })
  public readonly name: string = '';

  @BooleanProp({ fake: true })
  public readonly optIntoMarketingEmail: boolean;

  @StringProp({
    fake: JOE_BLOGGS_PHONE,
    optional: true,
  })
  public readonly phone?: string;

  @StringProp({
    fake: FAKE_SALT,
    optional: true,
  })
  public readonly salt: string;

  @StringProp({
    fake: FAKE_HASH,
    optional: true,
  })
  public readonly hash: string;

  @StringProp({
    fake: JOE_BLOGGS_USERNAME,
  })
  public readonly username: string;

  @BooleanProp({ fake: false })
  public readonly needsEmailVerification: boolean;

  @DateProp({
    optional: true,
  })
  public readonly passwordUpdatedAt?: Date;

  @DateProp({
    optional: true,
  })
  public readonly lastLoggedIn: Date;

  @StringProp({ fake: 'A short description', optional: true })
  public readonly summary: string = '';

  @MongoIDProp({ optional: true })
  public readonly avatarId?: string;

  @MongoIDProp({ optional: true })
  public readonly backgroundId?: string;

  @DateProp({ optional: true, fake: null })
  public readonly deletedAt?: Date;

  // CRM User aka Contact
  toCrmUser(): CRMUser {
    const [firstName, lastName] = splitFullName(this.name);
    return {
      email: this.email,
      firstName,
      jobTitle: this.headline,
      lastName,
      phone: this.phone,
      subscribeToMarketingUpdates: this.optIntoMarketingEmail,
    };
  }
}
