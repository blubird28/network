import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { JOE_BLOGGS_NAME } from '../../testing/data/constants';
import { Fake, FakeUuid } from '../../testing/data/fakers';
import { ReferencedById } from '../../ReferenceBuilder/decorators';

// Should be readable by the public, and writable only by the user/admins
@ReferencedById()
@Entity()
export class UserProfile {
  @FakeUuid
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Fake(JOE_BLOGGS_NAME)
  @Column({ type: String, length: 120 })
  public name: string;

  @Fake('Breaking News! Man bites dog')
  @Column({ type: 'text', nullable: false, default: '' })
  public headline: string;

  @Fake('A short description')
  @Column({ type: 'text', nullable: false, default: '' })
  public summary: string;
}
