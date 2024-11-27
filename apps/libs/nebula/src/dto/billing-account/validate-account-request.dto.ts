import { IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';
import { Expose } from 'class-transformer';

import {
  FAKE_BILLING_REQUEST,
  FAKE_COMPANY_DETAILS,
  FAKE_OBJECT_ID,
} from '@libs/nebula/testing/data/constants';
import { Fake } from '@libs/nebula/testing/data/fakers';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';

@DTOFaker()
export class ValidateAccountRequestDto {
  @Fake(FAKE_OBJECT_ID)
  @IsString()
  @IsOptional()
  @Expose()
  readonly transactionId: string;

  @Fake(FAKE_BILLING_REQUEST.bp_account_id)
  @ValidateIf((o) => o.insightSignedCompanyId !== undefined)
  @IsString()
  @Expose()
  readonly bpAccountId: string;

  @Fake(FAKE_COMPANY_DETAILS.insight_signed_company_id)
  @ValidateIf((o) => o.bpAccountId !== undefined)
  @IsNumber()
  @Expose()
  readonly insightSignedCompanyId: number;
}
