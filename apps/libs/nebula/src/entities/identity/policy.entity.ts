import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { connectReferences } from '../../testing/data/fakers/helpers';
import {
  DeepFakeMany,
  Fake,
  FakeDate,
  Faker,
  FakeUuid,
} from '../../testing/data/fakers';
import { ReferencedById } from '../../ReferenceBuilder/decorators';

import { LegacyBase } from './legacy-base';
import { PolicyStatement } from './policy-statement.entity';

@Faker({
  postProcess: connectReferences('statements[]policy'),
})
@ReferencedById()
@Entity()
export class Policy extends LegacyBase {
  @FakeUuid
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Fake('Policy description')
  @Column({ type: 'text', default: '', nullable: false })
  public description: string;

  @Fake('Policy name')
  @Column({ type: String, length: 120, default: '', nullable: false })
  public name: string;

  @Fake([])
  @Column({ type: 'jsonb', default: [], nullable: false })
  public tags: string[];

  @DeepFakeMany(() => PolicyStatement, {})
  @OneToMany(() => PolicyStatement, ({ policy }) => policy, {
    cascade: true,
    eager: true,
  })
  public statements: PolicyStatement[];

  @Fake('2018-03-01')
  @Column({ type: String, length: 120, default: '', nullable: false })
  public version: string;

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
