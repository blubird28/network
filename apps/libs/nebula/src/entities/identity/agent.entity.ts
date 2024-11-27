import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';

import { Policy } from '@libs/nebula/entities/identity/policy.entity';
import { JOE_BLOGGS_USERNAME } from '@libs/nebula/testing/data/constants';

import {
  DeepFake,
  DeepFakeMany,
  Fake,
  FakeDate,
} from '../../testing/data/fakers';

import { UserProfile } from './user-profile.entity';
import { Auth } from './auth.entity';
import { HasIdentity, IdentityBase } from './identity-base';
import { Identity } from './identity.entity';
import { Role } from './role.entity';

@HasIdentity()
export class Agent extends IdentityBase {
  public identity: Identity;

  @DeepFake(() => UserProfile)
  @OneToOne(() => UserProfile, { nullable: true, eager: true })
  @JoinColumn({ name: 'profile_id', foreignKeyConstraintName: 'PROFILE_ID_FK' })
  public profile: UserProfile;

  @DeepFake(() => Auth)
  @OneToOne(() => Auth, { nullable: false })
  @JoinColumn({ name: 'auth_id', foreignKeyConstraintName: 'AUTH_ID_FK' })
  public auth: Auth;

  @DeepFakeMany(() => Policy, {})
  @ManyToMany(() => Policy)
  @JoinTable({
    name: 'agent_policies',
    joinColumn: {
      referencedColumnName: 'identityId',
      name: 'agent_identity_id',
      foreignKeyConstraintName: 'AGENT_POLICIES_AGENT_IDENTITY_ID_FK',
    },
    inverseJoinColumn: {
      referencedColumnName: 'id',
      name: 'policy_id',
      foreignKeyConstraintName: 'AGENT_POLICIES_POLICY_ID_FK',
    },
  })
  public policies: Policy[];

  @DeepFakeMany(() => Role, {})
  @ManyToMany(() => Role)
  @JoinTable({
    name: 'agent_roles',
    joinColumn: {
      referencedColumnName: 'identityId',
      name: 'agent_identity_id',
      foreignKeyConstraintName: 'AGENT_ROLES_AGENT_IDENTITY_ID_FK',
    },
    inverseJoinColumn: {
      referencedColumnName: 'id',
      name: 'role_id',
      foreignKeyConstraintName: 'AGENT_ROLES_ROLE_ID_FK',
    },
  })
  public roles: Role[];

  @Fake(JOE_BLOGGS_USERNAME)
  @Column({ type: 'varchar', length: 120, nullable: true })
  public ldapId: string | null;

  @FakeDate()
  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @FakeDate()
  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;

  @FakeDate()
  @DeleteDateColumn({ type: 'timestamp' })
  public deletedAt: Date;

  @Expose({ toPlainOnly: true })
  get email(): string {
    return this.auth?.email;
  }
}
