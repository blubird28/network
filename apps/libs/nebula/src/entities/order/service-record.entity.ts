import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';

import { DeepFake, Fake, FakeUuid } from '@libs/nebula/testing/data/fakers';
import { FAKE_STATUS } from '@libs/nebula/testing/data/constants';

import { Order } from './order.entity';

@Entity()
export class ServiceRecord {
  @FakeUuid
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @DeepFake(() => Order)
  @ManyToOne(() => Order, (order) => order.id, { nullable: false })
  @JoinColumn({ name: 'orderId' })
  public order: Order;

  @FakeUuid
  @Column({ type: String, nullable: false, name: 'packageId' })
  public packageId: string;

  @FakeUuid
  @Column({ type: String, nullable: false, name: 'subscriptionId' })
  public subscriptionId: string;

  @Fake(FAKE_STATUS)
  @Column({ type: String, nullable: false })
  public status: string;

  @Expose({ name: 'orderId' })
  getOrderId() {
    return this.order?.id;
  }
}
