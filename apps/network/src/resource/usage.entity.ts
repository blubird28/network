import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';

import {
  DeepFake,
  Fake,
  FakeDate,
  FakeUuid,
} from '@libs/nebula/testing/data/fakers';
import {
  Serialized,
  SerializedObject,
} from '@libs/nebula/Serialization/serializes';
import { FIRST_JAN_2020 } from '@libs/nebula/testing/data/constants';
import { UsageType } from '@libs/nebula/Network/constants';

import { Resource } from './resource.entity';
import { Capability } from './capability.entity';

@Entity()
export class Usage {
  @FakeUuid
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'USAGE_ID_PK',
  })
  public id!: string;

  @DeepFake(() => Resource)
  @ManyToOne(() => Resource, (resource) => resource.usages)
  @JoinColumn({
    name: 'resource_id',
    foreignKeyConstraintName: 'USAGE_RESOURCE_ID_FK',
  })
  public resource: Resource;

  @DeepFake(() => Capability)
  @ManyToOne(() => Capability, (capability) => capability.usages)
  @JoinColumn({
    name: 'capability_id',
    foreignKeyConstraintName: 'USAGE_CAPABILITY_ID_FK',
  })
  public capability: Capability;

  @Column({ type: 'varchar', nullable: false })
  @Fake(UsageType.PUBLIC_IP)
  type: string;

  @Column({ type: 'integer', nullable: true })
  @Fake(100)
  amount: number;

  @Column({ type: 'jsonb', nullable: true })
  @Fake({ lastSynced: FIRST_JAN_2020 })
  @Transform(({ value }) => new Serialized(value), { toPlainOnly: true })
  meta: SerializedObject;

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
