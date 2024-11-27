import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import {
  DeepFakeMany,
  Fake,
  FakeDate,
  FakeUuid,
} from '../../testing/data/fakers';
import { ReferencedById } from '../../ReferenceBuilder/decorators';

import { LegacyBase } from './legacy-base';
import { Policy } from './policy.entity';

@ReferencedById()
@Entity()
export class Role extends LegacyBase {
  @FakeUuid
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Fake('Role')
  @Column({ type: String, length: 120, default: '', nullable: false })
  public display: string;

  @Fake('ROLE')
  @Column({ type: String, length: 120, default: '', nullable: false })
  public name: string;

  @Fake('group outline')
  @Column({ type: String, length: 32, default: '', nullable: false })
  public icon: string;

  @Fake(false)
  @Column({ type: Boolean, default: false })
  public keyholder: boolean;

  @Fake(false)
  @Column({ type: Boolean, default: false })
  public queryable: boolean;

  @Fake(false)
  @Column({ type: Boolean, default: false })
  public shieldOnly: boolean;

  @Fake(false)
  @Column({ type: Boolean, default: false })
  public systemDefault: boolean;

  @Fake(false)
  @Column({ type: Boolean, default: false })
  public unauthenticatedSystemDefault: boolean;

  @Fake([])
  @Column({ type: 'jsonb', default: [], nullable: false })
  public tags: string[];

  @DeepFakeMany(() => Policy)
  @ManyToMany(() => Policy, {
    eager: true,
  })
  @JoinTable()
  public policies: Policy[];

  @FakeDate()
  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @FakeDate()
  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;

  @FakeDate()
  @DeleteDateColumn({ type: 'timestamp' })
  public deletedAt: Date;
}
