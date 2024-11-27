import { IsBoolean, IsNotEmpty, IsString, NotEquals } from 'class-validator';
import { Expose } from 'class-transformer';

import { FAKE_BILLING_REQUEST } from '@libs/nebula/testing/data/constants';
import { Fake } from '@libs/nebula/testing/data/fakers';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';

import { EditBillingAccountRequestDto } from './edit-billing-account-request.dto';

@DTOFaker()
export class BPEditBillingAccountRequestDto extends EditBillingAccountRequestDto {
  @Expose()
  @IsString()
  @NotEquals(null)
  @IsNotEmpty()
  @Fake(FAKE_BILLING_REQUEST.bp_account_id)
  readonly id: string;

  @Expose({ name: 'zipCode' })
  @IsString()
  @NotEquals(null)
  @IsNotEmpty()
  @Fake(FAKE_BILLING_REQUEST.zip_code)
  readonly zipcode?: string;

  @Expose({ name: 'separateService' })
  @IsBoolean()
  @NotEquals(null)
  @IsNotEmpty()
  @Fake(FAKE_BILLING_REQUEST.separate_service_invoice)
  readonly separateServiceInvoice: boolean;
}
