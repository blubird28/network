import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
  ValidateIf,
} from 'class-validator';

import Errors from '@libs/nebula/Error';
import {
  FAKE_CUSTOMER_SERVICE_REFERENCE,
  FAKE_ORDERING_ENTITY_ID,
  JOE_BLOGGS_NAME,
  JOE_BLOGGS_EMAIL,
  FAKE_OBJECT_ID,
  FAKE_ISO8601_DATE,
  FAKE_BILLING_REQUEST,
  FAKE_COMPANY_NAME,
  FAKE_PRODUCT_NAME,
  FAKE_ORDER_NAME,
  FAKE_BP_PACKAGE_ID,
  FAKE_SUBSCRIPTION_REQUEST,
} from '@libs/nebula/testing/data/constants';
import {
  MAX_LENGTH_120,
  MAX_LENGTH_50,
} from '@libs/nebula/subscription/subscription.constants';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { Fake, DeepFakeMany } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';

import { BPAccountProductsDto } from './bp-account-products.dto';

@ExternalType()
@DTOFaker()
export class BPSubscriptionDto {
  @Fake(FAKE_OBJECT_ID)
  @Expose({ name: 'billingAccountId' })
  @MaxLength(MAX_LENGTH_50, { context: Errors.InvalidBillingAccountId.context })
  @IsNotEmpty({ context: Errors.InvalidBillingAccountId.context })
  @Type(() => String)
  accountId: string;

  @Fake(false)
  @Expose({ name: 'earlyTerminatedWaived' })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  readonly earlyTerminatedWaived?: boolean;

  @Fake(FAKE_OBJECT_ID)
  @Expose({ name: 'orderId' })
  @MaxLength(MAX_LENGTH_50, { context: Errors.InvalidOrderId.context })
  @IsNotEmpty({ context: Errors.InvalidOrderId.context })
  @Type(() => String)
  readonly orderId?: string;

  @Fake(FAKE_OBJECT_ID)
  @Expose({ name: 'serviceId' })
  @IsOptional()
  @MaxLength(MAX_LENGTH_50, { context: Errors.InvalidServiceId.context })
  @IsNotEmpty({ context: Errors.InvalidServiceId.context })
  @Type(() => String)
  readonly serviceId: string;

  @Fake(FAKE_BP_PACKAGE_ID)
  @Expose({ name: 'packageId' })
  @MaxLength(MAX_LENGTH_50, { context: Errors.InvalidPackageId.context })
  @IsNotEmpty({ context: Errors.InvalidPackageId.context })
  @Type(() => String)
  readonly packageId: string;

  @Fake(FAKE_ISO8601_DATE)
  @Expose({ name: 'startDate' })
  @IsNotEmpty()
  @IsISO8601()
  @Type(() => String)
  readonly startDate: string;

  @Fake(FAKE_SUBSCRIPTION_REQUEST.contract_start_date)
  @Expose({ name: 'contractStartDate' })
  @IsNotEmpty()
  @IsISO8601()
  @Type(() => String)
  readonly contractStartDate: string;

  @Fake(FAKE_SUBSCRIPTION_REQUEST.contract_end_date)
  @Expose({ name: 'contractEndDate' })
  @IsOptional()
  @ValidateIf((o, value) => value !== '')
  @IsISO8601()
  @Type(() => String)
  readonly contractEndDate?: string;

  @Fake(FAKE_BILLING_REQUEST.crm_customer_id)
  @Expose({ name: 'crmCustomerId' })
  @MaxLength(MAX_LENGTH_50)
  @IsOptional()
  @Type(() => String)
  readonly crmCustomerId?: string;

  @Fake(FAKE_CUSTOMER_SERVICE_REFERENCE)
  @Expose({ name: 'customerServiceReference' })
  @MaxLength(MAX_LENGTH_50)
  @IsString()
  @IsOptional()
  @Type(() => String)
  readonly customerServiceReference?: string;

  @Fake(FAKE_ORDERING_ENTITY_ID)
  @Expose({ name: 'orderingEntityId' })
  @MaxLength(MAX_LENGTH_50)
  @IsString()
  @IsOptional()
  @Type(() => String)
  readonly orderingEntity?: string;

  @Fake(JOE_BLOGGS_NAME)
  @Expose({ name: 'signedBdm' })
  @MaxLength(MAX_LENGTH_120)
  @IsString()
  @IsOptional()
  @Type(() => String)
  readonly signedBdm?: string;

  @Fake(JOE_BLOGGS_EMAIL)
  @Expose({ name: 'signedBdmEmail' })
  @MaxLength(MAX_LENGTH_120)
  @IsString()
  @IsEmail()
  @IsOptional()
  @Type(() => String)
  readonly signedBdmEmail?: string;

  @DeepFakeMany(() => BPAccountProductsDto)
  @Expose({ name: 'subscriptionProductDetails' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BPAccountProductsDto)
  accountProducts: BPAccountProductsDto[];

  @Fake(FAKE_COMPANY_NAME)
  @Expose()
  @IsString({ context: Errors.InvalidCompanyName.context })
  @MaxLength(MAX_LENGTH_50, { context: Errors.InvalidCompanyName.context })
  @Type(() => String)
  @IsNotEmpty({ context: Errors.InvalidCompanyName.context })
  readonly companyName: string;

  @Fake(FAKE_OBJECT_ID)
  @Expose()
  @MaxLength(MAX_LENGTH_50, { context: Errors.InvalidCompanyId.context })
  @IsString({ context: Errors.InvalidCompanyId.context })
  @Type(() => String)
  @IsNotEmpty({ context: Errors.InvalidCompanyId.context })
  readonly companyId: string;

  @Fake(FAKE_ORDER_NAME)
  @MaxLength(MAX_LENGTH_50, { context: Errors.InvalidOrderName.context })
  @Expose()
  @IsString({ context: Errors.InvalidOrderName.context })
  @Type(() => String)
  @IsNotEmpty({ context: Errors.InvalidOrderName.context })
  readonly orderName: string;

  @Fake(FAKE_PRODUCT_NAME)
  @MaxLength(MAX_LENGTH_50, { context: Errors.InvalidProductName.context })
  @Expose()
  @IsString({ context: Errors.InvalidProductName.context })
  @Type(() => String)
  @IsNotEmpty({ context: Errors.InvalidProductName.context })
  readonly productName: string;

  @Fake(FAKE_OBJECT_ID)
  @MaxLength(MAX_LENGTH_50, {
    context: Errors.InvalidProcessInstanceId.context,
  })
  @Expose()
  @Type(() => String)
  @IsString({ context: Errors.InvalidProcessInstanceId.context })
  @IsNotEmpty({ context: Errors.InvalidProcessInstanceId.context })
  readonly processInstanceId: string;
}
