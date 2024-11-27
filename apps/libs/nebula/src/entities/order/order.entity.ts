import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Fake, FakeDate, FakeUuid } from '@libs/nebula/testing/data/fakers';
import { FAKE_STATUS } from '@libs/nebula/testing/data/constants';

@Entity()
export class Order {
  @FakeUuid
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @FakeDate()
  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  public createdAt!: Date;

  @Fake(FAKE_STATUS)
  @Column({ type: String, nullable: false })
  status: string;
}
