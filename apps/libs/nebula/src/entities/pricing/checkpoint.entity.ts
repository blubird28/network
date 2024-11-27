import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Fake, FakeDate, FakeUuid } from '../../testing/data/fakers';

@Entity()
export class Checkpoint {
  @FakeUuid
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @FakeDate()
  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  public createdAt!: Date;

  @Fake('Remark')
  @Column({ type: String, length: 120 })
  public remark: string;
}
