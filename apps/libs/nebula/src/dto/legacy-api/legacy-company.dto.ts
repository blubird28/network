import { Expose, Type } from 'class-transformer';
import { Allow, IsOptional } from 'class-validator';
import moment from 'moment';

import DateProp from '@libs/nebula/dto/decorators/DateProp.decorator';

import BooleanProp from '../decorators/BooleanProp.decorator';
import ArrayProp from '../decorators/ArrayProp.decorator';
import StringProp, { MongoIDProp } from '../decorators/StringProp.decorator';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import {
  DeepFake,
  DeepFakeMany,
  Fake,
  FakeObjectId,
} from '../../testing/data/fakers';
import {
  ACME_BRN,
  ACME_BUSINESS_SEGMENT,
  ACME_CRM_INTERNAL_FLAG,
  ACME_DESCRIPTION,
  ACME_NAME,
  ACME_USERNAME,
  FAKE_OBJECT_ID,
  JOE_BLOGGS_EMAIL,
} from '../../testing/data/constants';
import { ReferencedById } from '../../ReferenceBuilder/decorators';
import { ExternalType } from '../../utils/external-type';
import { CRMCompany } from '../crm-sync/company/crm-company.interface';
import { toValidBusinessType } from '../crm-sync/utils';

import {
  ExternalReferenceType,
  LegacyCompanyExternalDto,
} from './legacy-company-external.dto';
import { LegacyCompanyDetailsDto } from './legacy-company-details.dto';

@ExternalType()
@ReferencedById()
@DTOFaker()
export class LegacyCompanyDto {
  @FakeObjectId
  @Type(() => String)
  @Expose()
  @Allow()
  public readonly id: string;

  @Fake(ACME_USERNAME)
  @Type(() => String)
  @Expose()
  @Allow()
  public readonly username: string;

  @Fake(ACME_NAME)
  @Type(() => String)
  @Expose()
  @Allow()
  public readonly name: string;

  @Fake('Breaking News! Man bites dog')
  @Type(() => String)
  @Expose()
  @Allow()
  public readonly headline: string = '';

  @Fake(ACME_DESCRIPTION)
  @Type(() => String)
  @Expose()
  @Allow()
  public readonly summary: string = '';

  @FakeObjectId
  @Type(() => String)
  @Expose()
  @IsOptional()
  public readonly avatarId?: string;

  @FakeObjectId
  @Type(() => String)
  @Expose()
  @IsOptional()
  public readonly backgroundId?: string;

  @StringProp({ optional: true, fake: ACME_BRN })
  public readonly businessRegistrationNumber?: string;

  @DeepFake(() => LegacyCompanyDetailsDto)
  @Expose()
  @Type(() => LegacyCompanyDetailsDto)
  @Allow()
  public readonly company?: LegacyCompanyDetailsDto;

  @BooleanProp({ fake: true, optional: true })
  verified = false;

  @BooleanProp({ fake: true, optional: true })
  verifiedIdentity = false;

  @BooleanProp({ fake: false, optional: true })
  deleted = false;

  @DateProp({ optional: true })
  public readonly created_at?: Date;

  @DateProp({ optional: true, fake: null })
  public readonly deletedAt?: Date;

  @DeepFakeMany(() => LegacyCompanyExternalDto, {})
  @ArrayProp()
  @Type(() => LegacyCompanyExternalDto)
  external: LegacyCompanyExternalDto[] = [];

  @StringProp({ optional: true, fake: JOE_BLOGGS_EMAIL })
  public readonly accountManagerEmail?: string;

  @MongoIDProp({ optional: true, fake: FAKE_OBJECT_ID })
  public readonly accountManagerId?: string;

  @StringProp({ optional: true, fake: ACME_BUSINESS_SEGMENT })
  public readonly businessPricingSegment?: string;

  @BooleanProp({ optional: true, fake: ACME_CRM_INTERNAL_FLAG })
  public readonly crmInternalFlag?: boolean;

  getInsightId(): string | undefined {
    return this.external?.find(
      (external) => external.type === ExternalReferenceType.Insight,
    )?.id;
  }

  toCRMCompany(): CRMCompany {
    return {
      name: this.company?.registeredName || this.name,
      domain: this.company?.emailDomains?.[0],
      businessRegistrationNumber: this.businessRegistrationNumber,
      address: this.company?.getRegisteredAddress()?.address,
      city: this.company?.getRegisteredAddress()?.city,
      state: this.company?.getRegisteredAddress()?.state,
      country: this.company?.getRegisteredAddress()?.country,
      zip: this.company?.getRegisteredAddress()?.zip,
      website: this.company?.website,
      description: this.summary,
      phone: this.company?.phone,
      businessType: toValidBusinessType(this.company?.businessType),
      verified: this.verifiedIdentity,
      invoiceEnabled: this.verified,
      insightId: this.getInsightId(),
      createdAt: moment(this.created_at).format('YYYY-MM-DD'),
      accountManagerEmail: this.accountManagerEmail,
      businessPricingSegment: this.businessPricingSegment,
      crmInternalFlag: this.crmInternalFlag,
    };
  }
}
