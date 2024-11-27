import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { Fake, FakeObjectId, FakeUuid } from '../../testing/data/fakers';
import { ReferencedById } from '../../ReferenceBuilder/decorators';

// Should only be readable/writeable by the user themselves and admins
@ReferencedById()
@Entity()
export class UserSettings {
  @FakeUuid
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @FakeObjectId
  @Column({ type: String, length: 24, nullable: true })
  public avatarId: string | null;

  // Currently, the background prop in the user profile contains a full URL (sometimes).
  // Eventually, this should work like avatar does - an id
  // When this has been completed the length can be restricted to 24
  @FakeObjectId
  @Column({ type: String, length: 160, nullable: true })
  public backgroundId: string | null;

  @Fake('(+61) 01 0203 0405')
  @Column({ type: String, length: 20, nullable: true })
  public phone: string | null;

  @Fake(true)
  @Column({ type: Boolean, default: false })
  public optIntoMarketingEmail: boolean;
}
