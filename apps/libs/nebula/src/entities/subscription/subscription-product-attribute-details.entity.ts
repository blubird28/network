import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  FAKE_ATTRIBUTE_NAME,
  FAKE_ATTRIBUTE_VALUE,
} from '@libs/nebula/testing/data/constants';

import { DeepFake, Fake, FakeUuid } from '../../testing/data/fakers';

import { SubscriptionProductDetails } from './subscription-product-details.entity';

@Entity()
export class SubscriptionProductAttributeDetails {
  @FakeUuid
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Fake(FAKE_ATTRIBUTE_NAME)
  @Column({ type: String, nullable: false, length: 120 })
  public name: string;

  @Fake(FAKE_ATTRIBUTE_VALUE)
  @Column({ type: String, nullable: true, length: 120 })
  public value: string;

  @DeepFake(() => SubscriptionProductDetails)
  @ManyToOne(
    () => SubscriptionProductDetails,
    (subscriptionProductDetails) => subscriptionProductDetails.id,
  )
  @JoinColumn()
  public subscriptionProductDetails: SubscriptionProductDetails;
}
