import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { FakeDate, FakeEmail, FakeUuid } from '../../testing/data/fakers';
import { ReferencedById } from '../../ReferenceBuilder/decorators';

@ReferencedById()
@Entity()
export class UserEmailChange {
  @FakeUuid
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @FakeEmail()
  @Column({ type: String, length: 120, nullable: false })
  public email: string;

  @FakeDate()
  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;
}
