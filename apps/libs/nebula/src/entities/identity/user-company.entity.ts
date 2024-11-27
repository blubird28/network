import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ReferencedById } from '../../ReferenceBuilder/decorators';
import {
  DeepFake,
  DeepFakeMany,
  Fake,
  FakeDate,
  FakeUuid,
} from '../../testing/data/fakers';

import { LegacyBase } from './legacy-base';
import { User } from './user.entity';
import { Company } from './company.entity';
import { Role } from './role.entity';

export enum UserCompanyStatus {
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
  DENIED = 'DENIED',
  CANCELLED = 'CANCELLED',
}

@ReferencedById()
@Entity()
export class UserCompany extends LegacyBase {
  @FakeUuid
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @FakeUuid
  @Column({ type: 'uuid', nullable: false })
  public userId: string;

  @FakeUuid
  @Column({ type: 'uuid', nullable: false })
  public companyId: string;

  @DeepFake(() => User)
  @ManyToOne(() => User, (user) => user.userCompanies)
  @JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'UC_USER_ID_FK' })
  public user: User;

  @DeepFake(() => Company)
  @ManyToOne(() => Company, (company) => company.userCompanies)
  @JoinColumn({
    name: 'company_id',
    foreignKeyConstraintName: 'UC_COMPANY_ID_FK',
  })
  public company: Company;

  @DeepFakeMany(() => Role, {})
  @ManyToMany(() => Role)
  @JoinTable()
  public roles: Role[];

  @Fake(UserCompanyStatus.ACTIVE)
  @Column({
    type: 'enum',
    enum: UserCompanyStatus,
    nullable: false,
    default: UserCompanyStatus.INACTIVE,
  })
  public status: UserCompanyStatus;

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
