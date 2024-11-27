import { In, JsonContains } from 'typeorm';
import { groupBy, keyBy } from 'lodash';

import { Injectable } from '@nestjs/common';

import { CapabilityType, ResourceType } from '@libs/nebula/Network/constants';

import { Resource } from '../resource/resource.entity';
import { ResourceService } from '../resource/resource.service';
import { ResourceTransactionService } from '../resource/resource-transaction.service';
import { CapabilityService } from '../resource/capability.service';

import {
  asBoolean,
  asDate,
  asNonEmptyString,
  asPrefixList,
  mergeASNs,
  normalizeAsn,
} from './utils';
import { ASNStore, PrefixSyncMetadata, StoredASN } from './asn.interfaces';
import { PrefixSync } from './prefix-sync.entity';
import { PrefixSyncStoreService } from './prefix-sync-store.service';

@Injectable()
export class ResourceASNStoreService implements ASNStore {
  constructor(
    private readonly resources: ResourceService,
    private readonly capabilities: CapabilityService,
    private readonly prefixSync: PrefixSyncStoreService,
    private readonly resourceTransactions: ResourceTransactionService,
  ) {}
  async getASNs(asns: number[], isPrivate = false): Promise<StoredASN[]> {
    const records = await this.resources.findByTypeAndSourceId(
      ResourceType.ASN,
      In(asns.map(String)),
      { meta: JsonContains({ private: isPrivate }) },
      isPrivate,
    );
    const resources = groupBy(records, ({ sourceId }) =>
      normalizeAsn(sourceId),
    );
    const syncRecords = keyBy(
      isPrivate ? [] : await this.prefixSync.findByAsns(asns),
      'asn',
    );
    return Object.keys(resources).map((asn) =>
      mergeASNs(
        resources[asn].map((record) =>
          this.toStoredASN(record, syncRecords[asn]),
        ),
      ),
    );
  }

  async getASN(asn: number, isPrivate = false): Promise<StoredASN> {
    const records = await this.resources.findByTypeAndSourceId(
      ResourceType.ASN,
      String(asn),
      { meta: JsonContains({ private: isPrivate }) },
      isPrivate,
    );

    const prefixSync = isPrivate ? null : await this.prefixSync.findByAsn(asn);

    return mergeASNs(
      records.map((record) => this.toStoredASN(record, prefixSync)),
    );
  }

  async updatePrefixSyncMetadata(
    asn: StoredASN,
    updates: Partial<PrefixSyncMetadata>,
  ): Promise<void> {
    await this.prefixSync.update(asn.asn, updates);
  }

  async allocatePrivateAsn(
    asn: StoredASN,
    companyId: string,
  ): Promise<StoredASN> {
    return this.allocateAsn(asn, {
      private: true,
      status: 'VERIFIED',
      companyId,
    });
  }

  async allocatePublicAsn(
    asn: StoredASN,
    companyId: string,
  ): Promise<StoredASN> {
    return this.allocateAsn(asn, {
      private: false,
      status: 'VERIFIED',
      companyId,
    });
  }

  async getASNResourceById(id: string): Promise<Resource> {
    return this.resources.findOneByTypeAndId(ResourceType.ASN, id);
  }

  private async allocateAsn(asn: StoredASN, meta): Promise<StoredASN> {
    if (asn.resourceIds.length) {
      await this.resources.restoreResourceById(asn.resourceIds[0]);
      await this.resources.updateResourceById(asn.resourceIds[0], { meta });
    } else {
      const resource = await this.resources.createResource({
        sourceId: asn.asn.toString(),
        type: ResourceType.ASN,
        meta,
      });
      await this.capabilities.createCapability({
        type: CapabilityType.ASN,
        resource,
      });
      asn.resourceIds.push(resource.id);
    }
    return asn;
  }

  private toStoredASN(
    resource: Resource,
    prefixSync?: PrefixSync | null,
  ): StoredASN {
    return {
      asn: parseInt(resource.sourceId, 10),
      consoleIds: [],
      deallocatedAt: asDate(resource.deletedAt),
      resourceIds: [resource.id],
      asSet: asNonEmptyString(resource?.meta.asSet),
      ipPrefixConfiguredInIPCV4: asPrefixList(
        prefixSync?.ipPrefixConfiguredInIPCV4,
      ),
      ipPrefixConfiguredInIPCV6: asPrefixList(
        prefixSync?.ipPrefixConfiguredInIPCV6,
      ),
      ipPrefixConfiguredInSLV4: asPrefixList(
        prefixSync?.ipPrefixConfiguredInSLV4,
      ),
      ipPrefixConfiguredInSLV6: asPrefixList(
        prefixSync?.ipPrefixConfiguredInSLV6,
      ),
      ipPrefixLastCheckedAt: asDate(prefixSync?.ipPrefixLastCheckedAt),
      ipPrefixLastErrorAt: asDate(prefixSync?.ipPrefixLastErrorAt),
      ipPrefixLastErrorReason: asNonEmptyString(
        prefixSync?.ipPrefixLastErrorReason,
      ),
      ipPrefixLastSLUpdateRequestAt: asDate(
        prefixSync?.ipPrefixLastSLUpdateRequestAt,
      ),
      ipPrefixLastSLUpdateSuccessAt: asDate(
        prefixSync?.ipPrefixLastSLUpdateSuccessAt,
      ),
      private: asBoolean(resource.meta?.private),
      skipPrefixSync: asBoolean(prefixSync?.skipPrefixSync),
      status:
        resource.meta?.status === 'VERIFIED'
          ? resource.meta.status
          : 'UNVERIFIED',
    };
  }

  public async deallocateAsn(asn: StoredASN) {
    const resource = await this.getASNResourceById(asn.resourceIds[0]);
    await this.resourceTransactions.removeResourceTransaction(resource);
  }
}
