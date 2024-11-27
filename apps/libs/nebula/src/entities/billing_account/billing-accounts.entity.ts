import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import {
  FAKE_BILLING_REQUEST,
  FAKE_COMPANY_DETAILS,
} from '@libs/nebula/testing/data/constants';
import { FakeUuid, Fake, FakeDate } from '@libs/nebula/testing/data/fakers';

import { Company } from './company.entity';

@Entity()
export class BillingAccounts {
  @FakeUuid
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Fake(FAKE_BILLING_REQUEST.companyId)
  @Column({ type: 'varchar', length: 50, default: '', nullable: false })
  public companyId: string;

  @Fake(FAKE_BILLING_REQUEST.bp_account_id)
  @Column({ type: 'varchar', length: 50 })
  public bpAccountId: string;

  @Fake(FAKE_BILLING_REQUEST.bp_billing_profile_uuid)
  @Column({ type: 'varchar', length: 50, default: '', nullable: false })
  public bpBillingProfileUuid: string;

  @Fake(FAKE_BILLING_REQUEST.name)
  @Column({ type: 'varchar', length: 256 })
  public name: string;

  @Fake(FAKE_BILLING_REQUEST.crm_customer_id)
  @Column({ type: 'varchar', length: 50 })
  public crmCustomerId: string;

  @Fake(FAKE_BILLING_REQUEST.pccw_epi_comp_id)
  @Column({ type: 'varchar', length: 50 })
  public pccwEpiCompId: string;

  @Fake(false)
  @Column({
    type: 'boolean',
    default: false,
    nullable: true,
  })
  public allowPricingInDifferentCurrency: boolean;

  @Fake(false)
  @Column({ type: 'boolean', default: false, nullable: true })
  public rateHierarchy: boolean;

  @Fake(true)
  @Column({ type: 'boolean', default: true, nullable: false })
  public invoiceAtThisLevel: boolean;

  @Fake(FAKE_BILLING_REQUEST.invoice_currency)
  @Column({ type: 'varchar', length: 50 })
  public invoiceCurrency: string;

  @Fake(FAKE_BILLING_REQUEST.address)
  @Column({ type: 'varchar', length: 512 })
  public address: string;

  @Fake(FAKE_BILLING_REQUEST.attention)
  @Column({ type: 'varchar', length: 512 })
  public attention: string;

  @Fake(FAKE_BILLING_REQUEST.bill_to)
  @Column({ type: 'varchar', length: 128 })
  public billTo: string;

  @Fake(FAKE_BILLING_REQUEST.billing_cycle)
  @Column({ type: 'varchar', length: 50 })
  public billingCycle: string;

  @Fake(FAKE_BILLING_REQUEST.city)
  @Column({ type: 'varchar', length: 128, nullable: true })
  public city: string;

  @Fake(FAKE_BILLING_REQUEST.country)
  @Column({ type: 'varchar', length: 50 })
  public country: string;

  @Fake(FAKE_BILLING_REQUEST.bill_contact_email)
  @Column({ type: 'varchar', length: 512 })
  public billContactEmail: string;

  @Fake(FAKE_BILLING_REQUEST.bill_contact_phone)
  @Column({ type: 'varchar', length: 32, nullable: true })
  public billContactPhone: string;

  @Fake(FAKE_BILLING_REQUEST.bill_contact_fax)
  @Column({ type: 'varchar', length: 32, nullable: true })
  public billContactFax: string;

  @Fake(FAKE_BILLING_REQUEST.invoice_delivery_method)
  @Column({ type: 'varchar', length: 50, nullable: true })
  public invoiceDeliveryMethod: string;

  @Fake(FAKE_BILLING_REQUEST.payment_method_text)
  @Column({
    type: 'varchar',
    length: 5000,
    default: '',
  })
  public paymentMethodText: string;

  @Fake(FAKE_BILLING_REQUEST.payment_method)
  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  public paymentMethod: string;

  @Fake(FAKE_BILLING_REQUEST.payment_term_days)
  @Column({ type: 'varchar', length: 32 })
  public paymentTermDays: string;

  @Fake(FAKE_BILLING_REQUEST.zip_code)
  @Column({ type: 'varchar', length: 32, nullable: true })
  public zipCode: string;

  @Fake(FAKE_BILLING_REQUEST.sales_contact_email)
  @Column({ type: 'varchar', length: 500 })
  public salesContactEmail: string;

  @Fake(FAKE_BILLING_REQUEST.sales_contact_name)
  @Column({ type: 'varchar', length: 500 })
  public salesContactName: string;

  @Fake(false)
  @Column({ type: 'boolean', default: false })
  public separateService: boolean;

  @Fake(false)
  @Column({ type: 'boolean', default: false })
  public manualClosing: boolean;

  @Fake(FAKE_BILLING_REQUEST.invoice_timezone)
  @Column({ type: 'varchar', length: 10, nullable: true })
  public invoiceTimezone: string;

  @Fake(FAKE_BILLING_REQUEST.our_contract_email)
  @Column({ type: 'varchar', length: 500, nullable: true })
  public ourContractEmail: string;

  @Fake(FAKE_BILLING_REQUEST.account_type)
  @Column({ type: 'varchar', length: 50, nullable: true })
  public accountType: string;

  @Fake(FAKE_BILLING_REQUEST.is_default)
  @Column({ type: 'boolean', default: false })
  public isDefault: boolean;

  @FakeDate()
  @CreateDateColumn({ type: 'timestamp', nullable: true })
  public createdAt: Date;

  @FakeDate()
  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  public updatedAt: Date;

  @Fake(FAKE_COMPANY_DETAILS)
  @ManyToOne(() => Company)
  @JoinColumn({
    name: 'pccw_epi_comp_id',
    referencedColumnName: 'pccwEpiCompId',
  })
  public company: Company;
}
