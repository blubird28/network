import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { Fake, FakeUuid } from '../../testing/data/fakers';
import { ReferencedById } from '../../ReferenceBuilder/decorators';

import { Policy } from './policy.entity';

export enum PolicyEffect {
  ALLOW = 'Allow',
  DENY = 'Deny',
}

@ReferencedById()
@Entity()
export class PolicyStatement {
  @FakeUuid
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Exclude()
  @Index()
  @ManyToOne(() => Policy, ({ statements }) => statements, {
    orphanedRowAction: 'delete',
  })
  public policy: Policy;

  @Fake('company-scoped-read-items')
  @Column({ type: String, length: 120, default: '', nullable: false })
  public sid: string;

  @Fake(PolicyEffect.ALLOW)
  @Column({
    type: 'enum',
    enum: PolicyEffect,
    nullable: false,
  })
  public effect: PolicyEffect;

  @Fake(['items:readItem'])
  @Column({ type: 'jsonb', default: [], nullable: false })
  public action: string[];

  @Fake(['rn:cc-item-service:${cc:accountId}:Items/*'])
  @Column({ type: 'jsonb', default: [], nullable: false })
  public resource: string[];

  @Fake(() => ({}))
  @Column({ type: 'jsonb', default: {}, nullable: false })
  public condition: Record<string, unknown>;
}
