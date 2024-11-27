import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  FAKE_COMMON_VALUE,
  FAKE_CURRENCY_CODE,
  FAKE_ISO8601_DATE,
  FAKE_OBJECT_ID,
  FAKE_PRICE,
  FAKE_RATING_METHOD,
  FAKE_UUID,
} from '@libs/nebula/testing/data/constants';

import {
  DeepFake,
  DeepFakeMany,
  Fake,
  FakeUuid,
} from '../../testing/data/fakers';

import { SubscriptionProductAttributeDetails } from './subscription-product-attribute-details.entity';
import { Subscriptions } from './subscriptions.entity';

@Entity()
export class SubscriptionProductDetails {
  @FakeUuid
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Fake(FAKE_OBJECT_ID)
  @Column({ type: 'varchar', nullable: false, length: 50 })
  public productId: string;

  @Fake(FAKE_OBJECT_ID)
  @Column({
    type: 'varchar',
    nullable: false,
    length: 50,
  })
  public packageProductId: string;

  @Fake(FAKE_ISO8601_DATE)
  @Column({ type: 'date', nullable: false })
  public startDate: Date;

  @Fake(FAKE_OBJECT_ID)
  @Column({ type: 'varchar', nullable: false, length: 50 })
  public billingAccountId: string;

  @Fake(FAKE_COMMON_VALUE)
  @Column({ type: String, nullable: false, length: 50 })
  public quantity: string;

  @Fake(FAKE_PRICE)
  @Column({ type: String, nullable: false, length: 50 })
  public rate: string;

  @Fake(FAKE_CURRENCY_CODE)
  @Column({ type: String, nullable: false, length: 50 })
  public currencyCode: string;

  @Fake(FAKE_COMMON_VALUE)
  @Column({ type: String, nullable: true, length: 50 })
  public rateMinCharge: string;

  @Fake(FAKE_RATING_METHOD)
  @Column({ type: String, nullable: true, length: 50 })
  public ratingMethod: string;

  @Fake(FAKE_ISO8601_DATE)
  @Column({ type: 'date', nullable: true })
  public renewalDate: Date;

  @Fake(FAKE_UUID)
  @Column({ type: 'varchar', nullable: true, length: 50 })
  public addonProductOfferingId: string;

  @Fake(FAKE_UUID)
  @Column({ type: 'varchar', nullable: true, length: 50 })
  public addonServiceId: string;

  @DeepFakeMany(() => SubscriptionProductAttributeDetails)
  @OneToMany(
    () => SubscriptionProductAttributeDetails,
    (subscriptionProductAttributeDetails) =>
      subscriptionProductAttributeDetails.subscriptionProductDetails,
    { nullable: false, cascade: true, eager: true },
  )
  public subscriptionProductAttributeDetails: SubscriptionProductAttributeDetails[];

  @DeepFake(() => Subscriptions)
  @ManyToOne(() => Subscriptions, (subscriptions) => subscriptions.id)
  @JoinColumn({ name: 'subscription_id' })
  public subscriptions: Subscriptions;
}
