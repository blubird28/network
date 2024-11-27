import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';

import {
  DeepFake,
  DeepFakeMany,
  Fake,
  FakeDate,
  FakeUuid,
} from '@libs/nebula/testing/data/fakers';
import {
  Serialized,
  SerializedObject,
} from '@libs/nebula/Serialization/serializes';
import { FIRST_JAN_2020 } from '@libs/nebula/testing/data/constants';
import { CapabilityType } from '@libs/nebula/Network/constants';

import { Resource } from './resource.entity';
import { Usage } from './usage.entity';

@Entity()
export class Capability {
  @FakeUuid
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'CAPABILITY_ID_PK',
  })
  public id!: string;

  @DeepFake(() => Resource)
  @ManyToOne(() => Resource, (resource) => resource.capabilities, {
    eager: true,
  })
  @JoinColumn({
    name: 'resource_id',
    foreignKeyConstraintName: 'CAPABILITY_RESOURCE_ID_FK',
  })
  resource: Resource;

  @OneToMany(() => Usage, (usage) => usage.capability)
  @DeepFakeMany(() => Usage)
  usages: Usage[];

  @Column({ type: 'varchar', nullable: false })
  @Fake(CapabilityType.IP_ADDRESSES)
  type: string;

  @Column({ type: 'integer', nullable: true })
  @Fake(1000)
  limit: number;

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
