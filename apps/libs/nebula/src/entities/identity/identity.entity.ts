import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { JOE_BLOGGS_USERNAME } from '../../testing/data/constants';
import { Fake, FakeUuid } from '../../testing/data/fakers';
import { ReferencedById } from '../../ReferenceBuilder/decorators';

import { LegacyBase } from './legacy-base';

export enum IdentityType {
  COMPANY = 'COMPANY',
  USER = 'USER',
  AGENT = 'AGENT',
}

export const IDENTITY_TYPE_ENUM_NAME = 'IDENTITY_TYPE_ENUM';

@ReferencedById()
@Entity()
export class Identity extends LegacyBase {
  @FakeUuid
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Fake(JOE_BLOGGS_USERNAME)
  @Column({ type: 'varchar', length: 120, nullable: false })
  @Index('IDENTITY_USERNAME_IDX')
  public username: string;

  @Fake(IdentityType.USER)
  @Column({
    type: 'enum',
    enum: IdentityType,
    enumName: IDENTITY_TYPE_ENUM_NAME,
    nullable: true,
  })
  @Index('IDENTITY_TYPE_IDX')
  public type: IdentityType | null;

  @Fake([])
  @ManyToMany(() => Identity, (identity) => identity.followers)
  @JoinTable()
  public following: Identity[];

  @Fake([])
  @ManyToMany(() => Identity, (identity) => identity.following)
  public followers: Identity[];
}
