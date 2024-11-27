import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';

import {
  FAKE_PRICE,
  FAKE_PRICE_UNIT,
} from '@libs/nebula/testing/data/constants';

import { DeepFake, Fake, FakeUuid } from '../../testing/data/fakers';

import { PriceRequest } from './price-request.entity';

@Entity()
export class Price {
  @FakeUuid
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @DeepFake(() => PriceRequest)
  @OneToOne(() => PriceRequest, (priceRequest) => priceRequest.price, {
    nullable: false,
  })
  @JoinColumn({ name: 'priceRequestId' })
  public priceRequest: PriceRequest;

  @Fake(FAKE_PRICE)
  @Column({ name: 'monthlyRecurringCost', type: 'decimal', nullable: false })
  public monthlyRecurringCost: number;

  @Fake(FAKE_PRICE)
  @Column({ name: 'nonRecurringCost', type: 'decimal', nullable: false })
  public nonRecurringCost: number;

  @Fake(FAKE_PRICE)
  @Column({
    name: 'usageCharge',
    type: 'decimal',
    nullable: true,
  })
  public usageCharge: number;

  @Fake(FAKE_PRICE_UNIT)
  @Column({
    name: 'usageChargeUnit',
    type: 'varchar',
    length: 50,
    default: 'Mbps',
    nullable: true,
  })
  public usageChargeUnit: string;

  @Fake(FAKE_PRICE)
  @Column({ name: 'totalContractValue', type: 'decimal', nullable: false })
  public totalContractValue: number;

  @Expose({ name: 'priceRequestId' })
  getPriceRequestId() {
    return this.priceRequest?.id;
  }
}
