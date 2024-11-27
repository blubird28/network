import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  FAKE_CUSTOMER_SERVICE_REFERENCE,
  FAKE_ORDERING_ENTITY_ID,
  JOE_BLOGGS_NAME,
  JOE_BLOGGS_EMAIL,
  FAKE_OBJECT_ID,
  FAKE_SUBSCRIPTION_STATUS_SUCCESS,
  FAKE_ISO8601_DATE,
  FAKE_TERMINATE_SUBSCRIPTION_REQUEST,
  FAKE_SUBSCRIPTION_REQUEST,
} from '@libs/nebula/testing/data/constants';

import { DeepFakeMany, Fake, FakeUuid } from '../../testing/data/fakers';

import { SubscriptionProductDetails } from './subscription-product-details.entity';

@Entity()
@Index(['billingAccountId', 'packageId', 'orderId', 'status'], { unique: true })
export class Subscriptions {
  @FakeUuid
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Fake(FAKE_OBJECT_ID)
  @Column({ type: 'varchar', nullable: false, length: 50 })
  public billingAccountId: string;

  @Fake(FAKE_OBJECT_ID)
  @Column({ type: 'varchar', nullable: true, length: 50 })
  public orderDisplayId: string;

  @Fake(FAKE_OBJECT_ID)
  @Column({ type: 'varchar', nullable: false, length: 50 })
  public productOfferingId: string;

  @Fake(FAKE_OBJECT_ID)
  @Column({ type: 'varchar', nullable: false, length: 50 })
  public packageId: string;

  @Fake(FAKE_SUBSCRIPTION_REQUEST.contract_start_date)
  @Column({ type: 'date', nullable: false })
  public contractStartDate: Date;

  @Fake(FAKE_SUBSCRIPTION_REQUEST.contract_end_date)
  @Column({ type: 'date', nullable: true })
  public contractEndDate: Date;

  @Fake(FAKE_TERMINATE_SUBSCRIPTION_REQUEST.termination_date)
  @Column({ type: 'date', nullable: true })
  public terminationDate: Date;

  @Fake(FAKE_TERMINATE_SUBSCRIPTION_REQUEST.termination_reason)
  @Column({ type: 'varchar', nullable: true, length: 120 })
  public terminationReason: string;

  @Fake(false)
  @Column({ type: Boolean, nullable: true })
  public earlyTerminatedWaived: boolean;

  @Fake(FAKE_OBJECT_ID)
  @Column({ type: 'varchar', nullable: true, length: 50 })
  public orderId: string;

  @Fake(FAKE_OBJECT_ID)
  @Column({ type: 'varchar', nullable: true, length: 50 })
  public serviceId: string;

  @Fake(FAKE_ISO8601_DATE)
  @Column({ type: 'date', nullable: false })
  public startDate: Date;

  @Fake(FAKE_CUSTOMER_SERVICE_REFERENCE)
  @Column({
    type: 'varchar',
    nullable: true,
    length: 50,
  })
  public customerServiceReference: string;

  @Fake(FAKE_ORDERING_ENTITY_ID)
  @Column({
    type: 'varchar',
    nullable: true,
    length: 50,
  })
  public orderingEntityId: string;

  @Fake(JOE_BLOGGS_NAME)
  @Column({ type: String, nullable: true, length: 120 })
  public signedBdm: string;

  @Fake(JOE_BLOGGS_EMAIL)
  @Column({ type: String, nullable: true, length: 120 })
  public signedBdmEmail: string;

  @Fake(FAKE_SUBSCRIPTION_STATUS_SUCCESS)
  @Column({ type: String, nullable: false, length: 50 })
  public status: string;

  @Fake(FAKE_OBJECT_ID)
  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  public bpSubscriptionId: string;

  @DeepFakeMany(() => SubscriptionProductDetails)
  @OneToMany(
    () => SubscriptionProductDetails,
    (subscriptionProductDetails) => subscriptionProductDetails.subscriptions,
    { nullable: false, cascade: true, eager: true },
  )
  public subscriptionProductDetails: SubscriptionProductDetails[];
}
