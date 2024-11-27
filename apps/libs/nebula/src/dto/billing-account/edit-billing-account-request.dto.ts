import { Expose, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional as IsOptionalValidator,
  IsString,
  Matches,
  NotEquals,
  ValidateIf,
  ValidationOptions,
} from 'class-validator';

import { FAKE_BILLING_REQUEST } from '@libs/nebula/testing/data/constants';
import { Fake } from '@libs/nebula/testing/data/fakers';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import { BILLING_ACCOUNT_PAYMENT_METHOD } from '@libs/nebula/billing-account/billing-account.constants';

const IsOptional = (nullable = false, validationOptions?: ValidationOptions) =>
  nullable
    ? IsOptionalValidator(validationOptions)
    : ValidateIf((obj, value) => value !== undefined, validationOptions);

@DTOFaker()
export class EditBillingAccountRequestDto {
  @Expose()
  @IsString()
  @NotEquals(null)
  @IsOptional()
  @IsNotEmpty()
  @Fake(FAKE_BILLING_REQUEST.address)
  readonly address?: string;

  @Expose()
  @IsString()
  @NotEquals(null)
  @IsOptional()
  @IsNotEmpty()
  @Fake(FAKE_BILLING_REQUEST.bill_to)
  readonly billTo?: string;

  @Expose()
  @IsString()
  @NotEquals(null)
  @IsOptional()
  @IsNotEmpty()
  @Fake(FAKE_BILLING_REQUEST.city)
  readonly city?: string;

  @Expose()
  @IsEmail()
  @NotEquals(null)
  @IsOptional()
  @IsNotEmpty()
  @Fake(FAKE_BILLING_REQUEST.bill_contact_email)
  readonly billContactEmail?: string;

  @Expose()
  @IsString()
  @NotEquals(null)
  @IsOptional()
  @Transform(({ value }) => value ?? '')
  @Matches(/(^$|^\+?\d+$)/, {
    message: 'billContactPhone must contain only numeric value',
  })
  @Fake(FAKE_BILLING_REQUEST.bill_contact_phone)
  readonly billContactPhone?: string;

  @Expose()
  @IsString()
  @NotEquals(null)
  @IsOptional()
  @Transform(({ value }) => value ?? '')
  @Fake(FAKE_BILLING_REQUEST.zip_code)
  readonly zipCode?: string;

  @Expose()
  @IsString()
  @NotEquals(null)
  @IsOptional()
  @IsNotEmpty()
  @Fake(FAKE_BILLING_REQUEST.payment_term_days)
  readonly paymentTermDays?: string;

  @Expose()
  @IsString()
  @NotEquals(null)
  @IsOptional()
  @IsNotEmpty()
  @Fake(FAKE_BILLING_REQUEST.payment_method)
  @IsEnum(BILLING_ACCOUNT_PAYMENT_METHOD)
  readonly paymentMethod?: BILLING_ACCOUNT_PAYMENT_METHOD;

  @Expose()
  @IsBoolean()
  @NotEquals(null)
  @IsOptional()
  @IsNotEmpty()
  @Fake(FAKE_BILLING_REQUEST.separate_service_invoice)
  readonly separateService?: boolean;

  @Expose()
  @IsString()
  @NotEquals(null)
  @IsOptional()
  @IsNotEmpty()
  @Fake(FAKE_BILLING_REQUEST.attention)
  readonly attention?: string;
}
