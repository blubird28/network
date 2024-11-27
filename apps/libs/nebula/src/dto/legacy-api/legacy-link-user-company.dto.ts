import { Expose, Type } from 'class-transformer';
import { Allow } from 'class-validator';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { Fake, FakeObjectId } from '../../testing/data/fakers';
import { FAKE_OBJECT_ID } from '../../testing/data/constants';
import { ReferencedById } from '../../ReferenceBuilder/decorators';
import { UserCompanyStatus } from '../../entities/identity/user-company.entity';
import { ExternalType } from '../../utils/external-type';

@ExternalType()
@ReferencedById()
@DTOFaker()
export class LegacyLinkUserCompanyDto {
  @FakeObjectId
  @Type(() => String)
  @Expose()
  @Allow()
  public readonly id: string;

  @FakeObjectId
  @Type(() => String)
  @Expose()
  @Allow()
  public readonly companyId: string;

  @FakeObjectId
  @Type(() => String)
  @Expose()
  @Allow()
  public readonly userId: string;

  @Fake([FAKE_OBJECT_ID])
  @Type(() => String)
  @Expose()
  @Allow()
  public readonly roleIds: string[];

  @Type(() => String)
  @Fake(UserCompanyStatus.ACTIVE)
  @Expose()
  @Allow()
  public readonly state: UserCompanyStatus;

  @Type(() => Boolean)
  @Fake(false)
  @Expose()
  @Allow()
  public readonly deleted: boolean;

  @Type(() => Date)
  @Fake(null)
  @Expose()
  @Allow()
  public readonly deletedAt: Date;
}
