import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { FakeObjectId, FakeUuid } from '../../testing/data/fakers';
import { ReferencedById } from '../../ReferenceBuilder/decorators';

// Should only be readable/writeable by the user themselves and admins
@ReferencedById()
@Entity()
export class CompanySettings {
  @FakeUuid
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @FakeObjectId
  @Column({ type: String, length: 24, nullable: true })
  public avatarId: string | null;

  @FakeObjectId
  @Column({ type: String, length: 160, nullable: true })
  public backgroundId: string | null;
}
