import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

import { FAKE_INSIGHT_REQUEST } from '@libs/nebula/testing/data/constants';
import {
  Fake,
  FakeUuid,
  FakeDate,
  DeepFakeMany,
} from '@libs/nebula/testing/data/fakers';

import { InsightRatingMethodDetails } from './insight-rating-method-details.entity';

@Entity()
export class InsightSubscriptionDetails {
  @FakeUuid
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Fake(FAKE_INSIGHT_REQUEST.orderId)
  @Column({ type: 'varchar', nullable: false, length: 50 })
  public orderId: string;

  @Fake(FAKE_INSIGHT_REQUEST.salesRecordId)
  @Column({ type: 'varchar', nullable: false, length: 50 })
  public salesRecordId: string;

  @Fake(FAKE_INSIGHT_REQUEST.serviceOrderId)
  @Column({ type: 'varchar', nullable: true, length: 50 })
  public serviceOrderId: string;

  @Fake(FAKE_INSIGHT_REQUEST.contractStartDate)
  @Column({ type: 'date', nullable: false })
  public contractStartDate: string;

  @Fake(FAKE_INSIGHT_REQUEST.contractEndDate)
  @Column({ type: 'date', nullable: true })
  public contractEndDate: string;

  @FakeDate()
  @CreateDateColumn({ type: 'timestamp', nullable: false })
  public createdAt: Date;

  @FakeDate()
  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  public updatedAt: Date;

  @FakeDate()
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  public deletedAt: Date;

  @DeepFakeMany(() => InsightRatingMethodDetails)
  @OneToMany(
    () => InsightRatingMethodDetails,
    (insightRatingMethodDetails) =>
      insightRatingMethodDetails.insightSubscriptionDetails,
    { nullable: false, cascade: true, eager: true },
  )
  public insightRatingMethodDetails: InsightRatingMethodDetails[];
}
