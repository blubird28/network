import { groupBy } from 'lodash';
import { isAxiosError } from 'axios';
import HttpStatusCodes from 'http-status-codes';

import { Injectable } from '@nestjs/common';

import { ShieldApiService } from '@libs/nebula/Http/ShieldApi/shield-api.service';
import { LegacyASNDto } from '@libs/nebula/dto/legacy-api/legacy-asn.dto';
import { LoopbackFilter } from '@libs/nebula/Http/utils/LoopbackFilter';
import toDto from '@libs/nebula/utils/data/toDto';
import { LegacyUpdateASNDto } from '@libs/nebula/dto/legacy-api/legacy-update-asn.dto';
import { LegacyCreateASNDto } from '@libs/nebula/dto/legacy-api/legacy-create-asn.dto';
import Errors from '@libs/nebula/Error';

import { ASNStore, StoredASN, PrefixSyncMetadata } from './asn.interfaces';
import {
  mergeASNs,
  asNonEmptyString,
  asDate,
  asPrefixList,
  asBoolean,
  getNumericASN,
} from './utils';

@Injectable()
export class ConsoleASNStoreService implements ASNStore {
  constructor(private readonly shieldApi: ShieldApiService) {}

  async getASNs(asns: number[], isPrivate = false): Promise<StoredASN[]> {
    const records = await this.shieldApi.getASNs(
      new LoopbackFilter({
        where: { asn: { inq: asns }, private: isPrivate },
      }),
    );
    const results = groupBy(records, 'asn');
    return Object.keys(results).map((asnKey) =>
      mergeASNs(results[asnKey].map((asn) => this.toStoredASN(asn))),
    );
  }

  async getASN(asn: number, isPrivate = false): Promise<StoredASN> {
    const records = await this.shieldApi.getASNs(
      new LoopbackFilter({ where: { asn: String(asn), private: isPrivate } }),
    );
    return mergeASNs(records.map((dto) => this.toStoredASN(dto)));
  }

  async updatePrefixSyncMetadata(
    asn: StoredASN,
    updates: Partial<PrefixSyncMetadata>,
  ): Promise<void> {
    const payload = toDto(updates, LegacyUpdateASNDto);
    await Promise.all(
      asn.consoleIds.map((id) => this.shieldApi.updateASN(id, payload)),
    );
  }

  async allocatePrivateAsn(
    asn: StoredASN,
    companyId: string,
  ): Promise<StoredASN> {
    const data = {
      companyId,
      private: true,
      asn: asn.asn,
      status: 'VERIFIED',
      deallocatedAt: null,
    };
    if (asn.consoleIds.length) {
      await this.shieldApi.updateASN(
        asn.consoleIds[0],
        toDto(data, LegacyUpdateASNDto),
      );
    } else {
      const response = await this.shieldApi.createASN(
        toDto(data, LegacyCreateASNDto),
      );
      asn.consoleIds.push(response.id);
    }
    return asn;
  }

  async getASNByConsoleId(asnId: string): Promise<LegacyASNDto> {
    try {
      return await this.shieldApi.getASNById(asnId);
    } catch (error) {
      if (
        isAxiosError(error) &&
        error.response?.status === HttpStatusCodes.NOT_FOUND
      ) {
        throw new Errors.ASNNotFound();
      }
      throw new Errors.Unknown();
    }
  }

  toStoredASN(dto: LegacyASNDto): StoredASN {
    return {
      asn: getNumericASN(dto.asn),
      consoleIds: [dto.id],
      resourceIds: [],
      asSet: asNonEmptyString(dto.asSet),
      deallocatedAt: asDate(dto.deallocatedAt),
      ipPrefixConfiguredInIPCV4: asPrefixList(dto.ipPrefixConfiguredInIPCV4),
      ipPrefixConfiguredInIPCV6: asPrefixList(dto.ipPrefixConfiguredInIPCV6),
      ipPrefixConfiguredInSLV4: asPrefixList(dto.ipPrefixConfiguredInSLV4),
      ipPrefixConfiguredInSLV6: asPrefixList(dto.ipPrefixConfiguredInSLV6),
      ipPrefixLastCheckedAt: asDate(dto.ipPrefixLastCheckedAt),
      ipPrefixLastErrorAt: asDate(dto.ipPrefixLastErrorAt),
      ipPrefixLastErrorReason: asNonEmptyString(dto.ipPrefixLastErrorReason),
      ipPrefixLastSLUpdateRequestAt: asDate(dto.ipPrefixLastSLUpdateRequestAt),
      ipPrefixLastSLUpdateSuccessAt: asDate(dto.ipPrefixLastSLUpdateSuccessAt),
      skipPrefixSync: asBoolean(dto.skipPrefixSync),
      private: asBoolean(dto.private),
      status: dto.status === 'VERIFIED' ? 'VERIFIED' : 'UNVERIFIED',
    };
  }

  public async deallocateAsn(asn: StoredASN) {
    const payload = toDto(
      {
        deallocatedAt: new Date(),
      },
      LegacyUpdateASNDto,
    );
    await this.shieldApi.updateASN(asn.consoleIds[0], payload);
  }
}
