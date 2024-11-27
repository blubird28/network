import { Column, Entity, PrimaryColumn } from 'typeorm';

import { Fake, FakeDate } from '@libs/nebula/testing/data/fakers';
import {
  FAKE_AS_SET,
  FAKE_ASN,
  FAKE_IP_V4_PREFIX,
  FAKE_IP_V6_PREFIX,
} from '@libs/nebula/testing/data/constants';

import { PrefixSyncMetadata } from './asn.interfaces';

@Entity()
export class PrefixSync implements PrefixSyncMetadata {
  @Fake(FAKE_ASN)
  @PrimaryColumn({
    name: 'asn',
    type: 'varchar',
    primaryKeyConstraintName: 'PREFIX_SYNC_ASN_PK',
  })
  asn: string;

  @Fake(FAKE_AS_SET)
  @Column({ type: 'varchar', nullable: true })
  asSet?: string;

  @Fake(false)
  @Column({ type: 'boolean', default: false })
  skipPrefixSync: boolean;

  @Fake([FAKE_IP_V4_PREFIX])
  @Column({ type: 'inet', array: true, default: [] })
  ipPrefixConfiguredInIPCV4?: string[] | null;

  @Fake([FAKE_IP_V6_PREFIX])
  @Column({ type: 'inet', array: true, default: [] })
  ipPrefixConfiguredInIPCV6?: string[] | null;

  @Fake([FAKE_IP_V4_PREFIX])
  @Column({ type: 'inet', array: true, default: [] })
  ipPrefixConfiguredInSLV4?: string[] | null;

  @Fake([FAKE_IP_V6_PREFIX])
  @Column({ type: 'inet', array: true, default: [] })
  ipPrefixConfiguredInSLV6?: string[] | null;

  @FakeDate()
  @Column({ type: 'timestamp', nullable: true })
  ipPrefixLastSLUpdateRequestAt?: Date | null;

  @FakeDate()
  @Column({ type: 'timestamp', nullable: true })
  ipPrefixLastSLUpdateSuccessAt?: Date | null;

  @FakeDate()
  @Column({ type: 'timestamp', nullable: true })
  ipPrefixLastCheckedAt?: Date | null;

  @FakeDate()
  @Column({ type: 'timestamp', nullable: true })
  ipPrefixLastErrorAt?: Date | null;

  @Fake('IP Prefix Sync failed')
  @Column({ type: 'varchar', nullable: true })
  ipPrefixLastErrorReason?: string | null;
}
