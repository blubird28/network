import {
  CreateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';

import {
  DeepFake,
  DeepFakeMany,
  FakeDate,
  MaybeDeepFake,
} from '../../testing/data/fakers';

import { UserProfile } from './user-profile.entity';
import { Auth } from './auth.entity';
import { UserEmailChange } from './user-email-change.entity';
import { UserSettings } from './user-settings.entity';
import { HasIdentity, IdentityBase } from './identity-base';
import { UserCompany } from './user-company.entity';
import { Identity } from './identity.entity';

@HasIdentity()
export class User extends IdentityBase {
  public identity: Identity;

  @DeepFake(() => UserProfile)
  @OneToOne(() => UserProfile, { nullable: true, eager: true })
  @JoinColumn()
  public profile: UserProfile;

  @DeepFake(() => UserSettings)
  @OneToOne(() => UserSettings, { nullable: true })
  @JoinColumn()
  public settings: UserSettings;

  @DeepFake(() => Auth)
  @OneToOne(() => Auth, { nullable: false })
  @JoinColumn()
  public auth: Auth;

  @MaybeDeepFake(() => UserEmailChange)
  @OneToOne(() => UserEmailChange)
  @JoinColumn()
  public newEmail: UserEmailChange | null;

  @DeepFakeMany(() => UserCompany)
  @OneToMany(() => UserCompany, (userCompany) => userCompany.user)
  public userCompanies: UserCompany[];

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
