import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

import {
  COMPANY,
  FAKE_BILLING_REQUEST,
  FAKE_CRM_COMPANY,
  FAKE_NUMBER,
} from '@libs/nebula/testing/data/constants';
import { DeepFakeMany, Fake } from '@libs/nebula/testing/data/fakers';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';

import { ShieldCompanyExternalDetails } from './shield-company-external-details.dto';

@DTOFaker()
export class ShieldCompanyDetailsDto {
  @Fake(FAKE_BILLING_REQUEST.companyId)
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly id: string;

  @Fake(FAKE_BILLING_REQUEST.bp_account_id)
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly billingAccount: string;

  @Fake(FAKE_NUMBER)
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  readonly signedCompanyRefId: number;

  @Fake(FAKE_BILLING_REQUEST.crm_customer_id)
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly insightId: string;

  @Fake(COMPANY.name)
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly name: string;

  @Fake(FAKE_CRM_COMPANY.verified)
  @IsBoolean()
  @IsNotEmpty()
  @Expose()
  readonly verified: boolean;

  @Fake(FAKE_CRM_COMPANY.verified)
  @IsBoolean()
  @IsNotEmpty()
  @Expose()
  readonly verifiedIdentity: boolean;

  @DeepFakeMany(() => ShieldCompanyExternalDetails)
  @Expose()
  @IsArray()
  @Type(() => ShieldCompanyExternalDetails)
  readonly external: ShieldCompanyExternalDetails[];
}
