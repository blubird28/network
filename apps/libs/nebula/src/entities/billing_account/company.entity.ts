import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import {
  FAKE_COMPANY_DETAILS,
  FAKE_NUMBER,
} from '@libs/nebula/testing/data/constants';
import { FakeUuid, Fake } from '@libs/nebula/testing/data/fakers';

@Entity()
export class Company {
  @FakeUuid
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Fake(FAKE_NUMBER)
  @Column({ type: 'integer' })
  public insightSignedCompanyId: number;

  @Fake(FAKE_COMPANY_DETAILS.billing_entity)
  @Column({ type: 'varchar', length: 120 })
  public billingEntity: string;

  @Fake(FAKE_COMPANY_DETAILS.branch)
  @Column({ type: 'varchar', length: 50, nullable: true })
  public branch: string;

  @Fake(FAKE_COMPANY_DETAILS.pccw_epi_comp_id)
  @Column({ type: 'varchar', length: 10, unique: true })
  public pccwEpiCompId: string;

  @Fake(FAKE_COMPANY_DETAILS.region)
  @Column({ type: 'varchar', length: 50, nullable: true })
  public region: string;

  @Fake(FAKE_COMPANY_DETAILS.eligible_for_online)
  @Column({ type: Boolean, default: false })
  public eligibleForOnline: boolean;

  @Fake(FAKE_COMPANY_DETAILS.default_billing_entity)
  @Column({ type: Boolean, default: false })
  public defaultBillingEntity: boolean;

  @Fake(FAKE_COMPANY_DETAILS.default_billing_region)
  @Column({ type: Boolean, default: false })
  public defaultBillingRegion: boolean;
}
