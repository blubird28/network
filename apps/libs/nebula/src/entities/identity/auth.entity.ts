import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Fake, FakeDate, FakeEmail, FakeUuid } from '../../testing/data/fakers';
import { FAKE_HASH, FAKE_SALT } from '../../testing/data/constants';
import { ReferencedById } from '../../ReferenceBuilder/decorators';

// TODO: Check current max lengths of production data in varchar fields

export enum AuthSource {
  SHIELD = 'SHIELD',
  CONSOLE = 'CONSOLE',
}

@ReferencedById()
@Entity()
export class Auth {
  @FakeUuid
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @FakeEmail()
  @Column({ type: 'varchar', length: 120, nullable: false })
  @Index('AUTH_EMAIL_IDX')
  public email: string;

  @Fake(AuthSource.CONSOLE)
  @Column({
    type: 'enum',
    enum: AuthSource,
    nullable: false,
    default: AuthSource.CONSOLE,
  })
  @Index('AUTH_SOURCE_IDX')
  public source: AuthSource;

  @BeforeUpdate()
  @BeforeInsert()
  emailToLowercase() {
    this.email = this.email.toLowerCase();
  }

  @Fake(FAKE_SALT)
  @Column({ type: 'varchar', length: 64, nullable: false })
  public salt: string;

  @Fake(FAKE_HASH)
  @Column({ type: 'varchar', length: 64, nullable: false })
  public hash: string;

  @Fake(false)
  @Column({ type: 'boolean', default: false })
  public needsEmailVerification: boolean;

  @FakeDate()
  @Column({ type: 'timestamp', nullable: true })
  public passwordUpdatedAt: Date | null;

  @FakeDate()
  @Column({ type: 'timestamp', nullable: true })
  public lastLoggedIn: Date;
}
