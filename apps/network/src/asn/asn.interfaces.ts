import { SerializedObject } from '@libs/nebula/Serialization/serializes';

export interface PrefixSyncMetadata {
  ipPrefixConfiguredInIPCV4?: string[] | null;
  ipPrefixConfiguredInIPCV6?: string[] | null;
  ipPrefixConfiguredInSLV4?: string[] | null;
  ipPrefixConfiguredInSLV6?: string[] | null;
  ipPrefixLastSLUpdateRequestAt?: Date | null;
  ipPrefixLastSLUpdateSuccessAt?: Date | null;
  ipPrefixLastErrorAt?: Date | null;
  ipPrefixLastErrorReason?: string | null;
  ipPrefixLastCheckedAt?: Date | null;
  skipPrefixSync: boolean;
}

export interface ASNMetadata extends SerializedObject {
  private: boolean;
  status: 'VERIFIED' | 'UNVERIFIED';
  asSet?: string;
}

export interface ASNDetails {
  asn: number;
  deallocatedAt?: Date | null;
  consoleIds: string[];
  resourceIds: string[];
}

export type StoredASN = ASNDetails & ASNMetadata & PrefixSyncMetadata;
export interface ASNStore {
  getASN(asn: number, isPrivate?: boolean): Promise<StoredASN | null>;
  updatePrefixSyncMetadata(
    asn: StoredASN,
    updates: Partial<PrefixSyncMetadata>,
  ): Promise<void>;
  getASNs(asn: number[], isPrivate?: boolean): Promise<StoredASN[]>;
  allocatePrivateAsn(asn: StoredASN, companyId: string): Promise<StoredASN>;
  deallocateAsn(asn: StoredASN): Promise<void>;
}
