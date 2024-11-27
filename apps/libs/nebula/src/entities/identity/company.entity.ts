import {
  Column,
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
  Fake,
  FakeDate,
} from '../../testing/data/fakers';

import { HasIdentity, IdentityBase } from './identity-base';
import { CompanyProfile } from './company-profile.entity';
import { CompanySettings } from './company-settings.entity';
import { UserCompany, UserCompanyStatus } from './user-company.entity';
import { Identity } from './identity.entity';

@HasIdentity()
export class Company extends IdentityBase {
  public identity: Identity;

  @DeepFake(() => CompanyProfile)
  @OneToOne(() => CompanyProfile, { nullable: true, eager: true })
  @JoinColumn()
  public profile: CompanyProfile;

  @DeepFake(() => CompanySettings)
  @OneToOne(() => CompanySettings, { nullable: true })
  @JoinColumn()
  public settings: CompanySettings;

  @DeepFakeMany(() => UserCompany)
  @OneToMany(() => UserCompany, (userCompany) => userCompany.company)
  public userCompanies: UserCompany[];

  @Fake(false)
  @Column({ type: Boolean, nullable: false, default: false })
  public verified: boolean;

  @Fake(false)
  @Column({ type: Boolean, nullable: false, default: false })
  public verifiedIdentity: boolean;

  @Expose()
  public get activeMemberships(): UserCompany[] {
    return (this.userCompanies ?? []).filter(
      ({ status }) => status === UserCompanyStatus.ACTIVE,
    );
  }

  @Expose()
  public get companies(): Company[] {
    return this.activeMemberships.map(({ company }) => company);
  }

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
