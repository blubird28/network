import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { ACME_DESCRIPTION, ACME_NAME } from '../../testing/data/constants';
import { Fake, FakeUuid } from '../../testing/data/fakers';
import { ReferencedBy } from '../../ReferenceBuilder/decorators';

// Should be readable by the public, and writable only by the user/admins
@ReferencedBy<CompanyProfile>(({ id }) => `id = ${id}`)
@Entity()
export class CompanyProfile {
  @FakeUuid
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Fake(ACME_NAME)
  @Column({ type: String, length: 120 })
  public name: string;

  @Fake('Breaking News! Man bites dog')
  @Column({ type: 'text', nullable: false, default: '' })
  public headline: string;

  @Fake(ACME_DESCRIPTION)
  @Column({ type: 'text', nullable: false, default: '' })
  public summary: string;
}
