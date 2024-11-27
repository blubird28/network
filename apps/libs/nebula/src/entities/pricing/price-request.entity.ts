import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';

import { Price } from '@libs/nebula/entities/pricing/price.entity';
import { AttributeRecord } from '@libs/nebula/basic-types';

import { DeepFake, Fake, FakeUuid } from '../../testing/data/fakers';
import { FAKE_ATTRIBUTES, FAKE_MD5_HASH } from '../../testing/data/constants';

import { Checkpoint } from './checkpoint.entity';

@Entity()
export class PriceRequest {
  @FakeUuid
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Fake(FAKE_MD5_HASH)
  @Column({ type: String, length: 64, nullable: false, unique: true })
  public hash: string;

  @Fake('widget_price_final')
  @Column({ name: 'priceKey', type: String, length: 64, nullable: false })
  public priceKey: string;

  @Fake('widget')
  @Column({ type: String, length: 64, nullable: false })
  public product: string;

  @Fake(FAKE_MD5_HASH)
  @Column({ type: String, length: 64, nullable: false })
  public timecode: string;

  @DeepFake(() => Checkpoint)
  @ManyToOne(() => Checkpoint, (checkpoint) => checkpoint.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'checkpointId' })
  public checkpoint: Checkpoint;

  @Fake(FAKE_ATTRIBUTES)
  @Column({ type: 'jsonb' })
  public attributes: AttributeRecord;

  @OneToOne(() => Price, (price) => price.priceRequest)
  public price: Price;

  @Expose({ name: 'checkpointId' })
  getCheckpointId() {
    return this.checkpoint?.id;
  }
}
