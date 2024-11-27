import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  FAKE_OBJECT_ID,
  FAKE_RATING_METHOD,
} from '@libs/nebula/testing/data/constants';

import { DeepFake, Fake, FakeUuid, FakeDate } from '../../testing/data/fakers';

import { InsightSubscriptionDetails } from './insight-subscription-details.entity';

@Entity()
export class InsightRatingMethodDetails {
  @FakeUuid
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Fake(FAKE_RATING_METHOD)
  @Column({ type: 'varchar', nullable: false, length: 50 })
  public ratingMethod: string;

  @Fake(FAKE_OBJECT_ID)
  @Column({ type: 'varchar', nullable: false, length: 50 })
  public rate: string;

  @FakeDate()
  @CreateDateColumn({ type: 'timestamp', nullable: false })
  public createdAt: Date;

  @FakeDate()
  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  public updatedAt: Date;

  @FakeDate()
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  public deletedAt: Date;

  @DeepFake(() => InsightSubscriptionDetails)
  @ManyToOne(
    () => InsightSubscriptionDetails,
    (insightSubscriptionDetails) =>
      insightSubscriptionDetails.insightRatingMethodDetails,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  public insightSubscriptionDetails: InsightSubscriptionDetails;
}
