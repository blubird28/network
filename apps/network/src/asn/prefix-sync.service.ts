import { isAxiosError } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { isEmpty } from 'lodash';
import { JsonContains } from 'typeorm';

import { Injectable, Logger } from '@nestjs/common';

import Errors from '@libs/nebula/Error';
import getErrorMessage from '@libs/nebula/utils/data/getErrorMessage';
import { PrefixLookupResponseDto } from '@libs/nebula/dto/network/prefix-lookup-response.dto';
import { pathJoin } from '@libs/nebula/utils/data/pathJoin';
import { urlTemplate } from '@libs/nebula/Http/utils/urlTemplate';
import { ResourceType, UsageType } from '@libs/nebula/Network/constants';

import { PrefixLookupHttpService } from '../odp/prefix-lookup-http.service';
import { ServiceLayerHttpService } from '../service-layer/service-layer-http.service';
import { ResourceService } from '../resource/resource.service';

import { StoredASN } from './asn.interfaces';
import { arePrefixListsEqual } from './utils';
import { ASNStoreService } from './asn-store.service';
import { REST_ASN_PREFIX, REST_SYNC_ASN_SL_CALLBACK_PATH } from './constants';

@Injectable()
export class PrefixSyncService {
  private readonly logger = new Logger(PrefixSyncService.name);
  constructor(
    private readonly asns: ASNStoreService,
    private readonly prefixLookup: PrefixLookupHttpService,
    private readonly serviceLayer: ServiceLayerHttpService,
    private readonly resources: ResourceService,
  ) {}

  async syncStoredASN(asn: StoredASN | null, force = false) {
    if (this.canSync(asn)) {
      const prefixes = await this.getPrefixesForASN(asn);

      if (this.shouldSync(prefixes, asn, force)) {
        await this.sendPrefixesToSL(prefixes, asn);
      } else {
        this.logger.debug(`No update was sent to service layer`);
      }
    }
  }

  async syncASNCallback(asn: StoredASN | null, code: number, message: string) {
    if (this.canSync(asn)) {
      if (this.serviceLayer.isSuccessCode(code)) {
        await this.asns.updatePrefixSyncMetadata(asn, {
          ipPrefixLastSLUpdateSuccessAt: new Date(),
          ipPrefixConfiguredInSLV4: asn.ipPrefixConfiguredInIPCV4,
          ipPrefixConfiguredInSLV6: asn.ipPrefixConfiguredInIPCV6,
        });
      } else {
        await this.asns.updatePrefixSyncMetadata(asn, {
          ipPrefixLastErrorAt: new Date(),
          ipPrefixLastErrorReason: message,
        });
      }
    }
  }

  async getASNsToSync(): Promise<number[]> {
    const resources = await this.resources.findByActiveUsage(UsageType.ASN, {
      type: ResourceType.ASN,
      meta: JsonContains({ private: false }),
    });
    return resources.map(({ sourceId }) => parseInt(sourceId, 10));
  }

  private canSync(asn: StoredASN | null): boolean {
    if (!asn || isEmpty(asn.consoleIds) || isEmpty(asn.resourceIds)) {
      throw new Errors.CannotSyncASNNotReferenced({ asn: asn?.asn });
    }
    if (asn.private) {
      throw new Errors.CannotSyncPrivateASN({ asn: asn.asn });
    }
    if (asn.skipPrefixSync) {
      // TODO: slack
      this.logger.log(
        `ASN: ${asn.asn} was not synced because skipPrefixSync is set to true`,
      );
      return false;
    }
    return true;
  }

  private shouldSync(
    prefixes: PrefixLookupResponseDto,
    storedASN: StoredASN,
    force = false,
  ) {
    const hasV4Changes = !arePrefixListsEqual(
      storedASN.ipPrefixConfiguredInSLV4,
      prefixes.ipv4,
    );
    this.logger.debug(
      `There are${hasV4Changes ? '' : ' no '} changes in v4 prefix lists`,
    );
    const hasV6Changes = !arePrefixListsEqual(
      storedASN.ipPrefixConfiguredInSLV6,
      prefixes.ipv6,
    );
    this.logger.debug(
      `There are${hasV6Changes ? '' : ' no '} changes in v6 prefix lists`,
    );
    this.logger.debug(`The sync is${force ? '' : ' not '} being forced`);

    return hasV4Changes || hasV6Changes || force;
  }

  private async getPrefixesForASN(storedASN: StoredASN) {
    const prefixes = await this.fetchPrefixesFromIPC(storedASN);
    this.logger.debug(
      `Got ${prefixes.ipv4.length} v4 and ${prefixes.ipv6.length} v6 prefixes`,
    );

    await this.asns.updatePrefixSyncMetadata(storedASN, {
      ipPrefixConfiguredInIPCV4: prefixes.ipv4,
      ipPrefixConfiguredInIPCV6: prefixes.ipv6,
      ipPrefixLastCheckedAt: new Date(),
    });

    return prefixes;
  }

  private async fetchPrefixesFromIPC(
    storedASN: StoredASN,
  ): Promise<PrefixLookupResponseDto> {
    const { asn, asSet } = storedASN;
    const now = new Date();
    try {
      return asSet
        ? await this.prefixLookup.lookupASSetPrefixes(asSet)
        : await this.prefixLookup.lookupASNPrefixes(asn);
    } catch (err) {
      this.logger.error(
        `Failed to fetch prefixes for ${
          asSet ? 'AS-SET: ' + asSet : 'ASN: ' + asn
        }; error: ${getErrorMessage(err)}`,
      );
      if (isAxiosError(err) && err.response?.status === StatusCodes.NOT_FOUND) {
        await this.asns.updatePrefixSyncMetadata(storedASN, {
          ipPrefixLastCheckedAt: now,
          ipPrefixLastErrorAt: now,
          ipPrefixLastErrorReason: `${
            asSet ? 'AS-SET' : 'ASN'
          } was not found in PrefixLookup API`,
        });
      }
      throw err;
    }
  }

  private async sendPrefixesToSL(
    prefixes: PrefixLookupResponseDto,
    storedASN: StoredASN,
  ) {
    this.logger.debug(`Sending prefix update to Service Layer`);
    try {
      await this.serviceLayer.updatePrefixSet(
        storedASN.asn,
        prefixes.ipv4,
        prefixes.ipv6,
        urlTemplate(pathJoin(REST_ASN_PREFIX, REST_SYNC_ASN_SL_CALLBACK_PATH), {
          asn: String(storedASN.asn),
        }),
      );
    } catch (err) {
      const reason = getErrorMessage(err);
      const now = new Date();
      this.logger.error(`Error sending prefixes to Service Layer: ${reason}`);
      await this.asns.updatePrefixSyncMetadata(storedASN, {
        ipPrefixLastErrorAt: now,
        ipPrefixLastSLUpdateRequestAt: now,
        ipPrefixLastErrorReason: reason,
      });
      throw err;
    }

    await this.asns.updatePrefixSyncMetadata(storedASN, {
      ipPrefixLastSLUpdateRequestAt: new Date(),
    });
  }
}
