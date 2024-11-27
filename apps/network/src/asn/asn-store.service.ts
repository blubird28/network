import { groupBy } from 'lodash';

import { Injectable } from '@nestjs/common';

import Errors from '@libs/nebula/Error';

import { ConsoleASNStoreService } from './console-asn-store.service';
import { ResourceASNStoreService } from './resource-asn-store.service';
import { ASNStore, PrefixSyncMetadata, StoredASN } from './asn.interfaces';
import { getNumericASN, mergeASNs } from './utils';

@Injectable()
export class ASNStoreService implements ASNStore {
  constructor(
    private readonly consoleASNs: ConsoleASNStoreService,
    private readonly resourceASNs: ResourceASNStoreService,
  ) {}

  async getASN(asn: number, isPrivate = false): Promise<StoredASN | null> {
    const [console, resource] = await Promise.all([
      this.consoleASNs.getASN(asn, isPrivate),
      this.resourceASNs.getASN(asn, isPrivate),
    ]);

    return mergeASNs([console, resource]);
  }

  async updatePrefixSyncMetadata(
    asn: StoredASN,
    meta: Partial<PrefixSyncMetadata>,
  ): Promise<void> {
    await Promise.all([
      this.consoleASNs.updatePrefixSyncMetadata(asn, meta),
      this.resourceASNs.updatePrefixSyncMetadata(asn, meta),
    ]);
  }

  async getASNs(asns: number[], isPrivate = false): Promise<StoredASN[]> {
    const [console, resource] = await Promise.all([
      this.consoleASNs.getASNs(asns, isPrivate),
      this.resourceASNs.getASNs(asns, isPrivate),
    ]);

    return Object.values(groupBy([...console, ...resource], 'asn')).map(
      mergeASNs,
    );
  }

  async allocatePrivateAsn(
    asn: StoredASN,
    companyId: string,
  ): Promise<StoredASN> {
    const [console, resource] = await Promise.all([
      this.consoleASNs.allocatePrivateAsn(asn, companyId),
      this.resourceASNs.allocatePrivateAsn(asn, companyId),
    ]);
    return mergeASNs([console, resource]);
  }

  async getASNByResourceId(resourceId: string) {
    const resource = await this.resourceASNs.getASNResourceById(resourceId);
    return this.getASN(getNumericASN(resource.sourceId));
  }

  async getPublicASNByConsoleId(asnId: string): Promise<StoredASN> {
    const legacyAsnDto = await this.consoleASNs.getASNByConsoleId(asnId);
    return this.resourceASNs.allocatePublicAsn(
      this.consoleASNs.toStoredASN(legacyAsnDto),
      legacyAsnDto.companyId,
    );
  }

  async deallocateAsn(asn: StoredASN) {
    if (!asn.private) {
      throw new Errors.CannotDeallocatePublicASN({ asn: asn.asn });
    }
    if (asn.resourceIds.length > 1 || asn.consoleIds.length > 1) {
      throw new Errors.DuplicatePrivateASN({ asn: asn.asn });
    }
    await Promise.all([
      this.consoleASNs.deallocateAsn(asn),
      this.resourceASNs.deallocateAsn(asn),
    ]);
  }
}
