import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';
import { isEmpty } from 'lodash';

import {
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
import { ResourceType } from '@libs/nebula/Network/constants';

import { Capability } from './capability.entity';
import { Usage } from './usage.entity';

@Entity()
export class Resource {
  @FakeUuid
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'RESOURCE_ID_PK',
  })
  public id!: string;

  @OneToMany(() => Capability, (capability) => capability.resource)
  @DeepFakeMany(() => Capability)
  capabilities: Capability[];

  @OneToMany(() => Usage, (usage) => usage.resource)
  @DeepFakeMany(() => Usage)
  usages: Usage[];

  @Column({ type: 'varchar', nullable: false })
  @Fake(ResourceType.IOD_SITE)
  type: string;

  @Index('SOURCE_ID_INDEX')
  @Column({ type: 'varchar', nullable: false })
  @FakeUuid
  sourceId: string;

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

  public isBeingUsed(): boolean {
    return !!this.capabilities?.some(({ usages }) => !isEmpty(usages));
  }
}
