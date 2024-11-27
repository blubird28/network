import {
  FAKE_AS_SET,
  FAKE_ASN,
  FAKE_IP_V4_PREFIX,
  FAKE_IP_V6_PREFIX,
  FAKE_UUID,
  FIRST_JAN_2020,
} from '@libs/nebula/testing/data/constants';

import { ASNMetadata, PrefixSyncMetadata, StoredASN } from './asn.interfaces';

export const FAKE_STORED_ASN_PREFIX_SYNC_METADATA: PrefixSyncMetadata = {
  ipPrefixConfiguredInIPCV4: [FAKE_IP_V4_PREFIX],
  ipPrefixConfiguredInIPCV6: [FAKE_IP_V6_PREFIX],
  ipPrefixConfiguredInSLV4: [FAKE_IP_V4_PREFIX],
  ipPrefixConfiguredInSLV6: [FAKE_IP_V6_PREFIX],
  ipPrefixLastCheckedAt: FIRST_JAN_2020,
  ipPrefixLastErrorAt: FIRST_JAN_2020,
  ipPrefixLastErrorReason: 'Error',
  ipPrefixLastSLUpdateRequestAt: FIRST_JAN_2020,
  ipPrefixLastSLUpdateSuccessAt: FIRST_JAN_2020,
  skipPrefixSync: false,
};

export const FAKE_STORED_ASN_RESOURCE_META: ASNMetadata = {
  asSet: FAKE_AS_SET,
  private: true,
  status: 'VERIFIED',
};

export const FAKE_STORED_ASN: StoredASN = {
  ...FAKE_STORED_ASN_RESOURCE_META,
  ...FAKE_STORED_ASN_PREFIX_SYNC_METADATA,
  asn: FAKE_ASN,
  consoleIds: [FAKE_UUID],
  resourceIds: [FAKE_UUID],
  deallocatedAt: null,
};

export const FAKE_STORED_PRIVATE_ASN: StoredASN = {
  ...FAKE_STORED_ASN_RESOURCE_META,
  asn: FAKE_ASN,
  consoleIds: [FAKE_UUID],
  resourceIds: [FAKE_UUID],
  deallocatedAt: null,
  ipPrefixConfiguredInIPCV4: null,
  ipPrefixConfiguredInIPCV6: null,
  ipPrefixConfiguredInSLV4: null,
  ipPrefixConfiguredInSLV6: null,
  ipPrefixLastCheckedAt: null,
  ipPrefixLastErrorAt: null,
  ipPrefixLastErrorReason: null,
  ipPrefixLastSLUpdateRequestAt: null,
  ipPrefixLastSLUpdateSuccessAt: null,
  skipPrefixSync: false,
};
