import moment from 'moment';
import {
  flatMap,
  intersection,
  isEmpty,
  isInteger,
  map,
  random,
  without,
} from 'lodash';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LegacyIODServiceDto } from '@libs/nebula/dto/legacy-api/legacy-iod-service.dto';
import Errors from '@libs/nebula/Error';
import { ShieldApiService } from '@libs/nebula/Http/ShieldApi/shield-api.service';
import { LoopbackFilter } from '@libs/nebula/Http/utils/LoopbackFilter';

import { NetworkConfig } from '../config/config.module';

import { ASNStoreService } from './asn-store.service';
import { StoredASN } from './asn.interfaces';

@Injectable()
export class PrivateASNService {
  constructor(
    private readonly asn: ASNStoreService,
    private readonly shield: ShieldApiService,
    @Inject(ConfigService)
    private readonly config: ConfigService<NetworkConfig>,
  ) {}

  private readonly logger: Logger = new Logger(PrivateASNService.name);

  public async allocatePrivateAsn(
    companyId: string,
    autoAssign = false,
    requestedAsn?: number,
  ): Promise<StoredASN> {
    if (!companyId) {
      throw new Errors.InvalidCompanyId({ data: companyId });
    }
    const asns = this.getSuggestedASNs(requestedAsn, autoAssign);
    if (isEmpty(asns)) {
      throw new Errors.NoUsableASNs();
    }
    const validAsn = await this.getValidASN(asns, companyId);
    return this.asn.allocatePrivateAsn(validAsn, companyId);
  }

  public getSuggestedASNs(requestedASN?: number, autoAssign = false): number[] {
    const start: number = this.config.get<number>('PRIVATE_ASN_RANGE_START');
    const end: number = this.config.get<number>('PRIVATE_ASN_RANGE_END');
    if (autoAssign || !isInteger(requestedASN)) {
      const amt = this.config.get<number>('PRIVATE_ASN_AMT_TO_GENERATE');
      const possibleASNs = end - start;
      if (amt > possibleASNs || amt < 1) {
        throw new Errors.InvalidValidationConfig();
      }
      return Array.from({ length: amt }, () => random(start, end));
    }
    if (isInteger(requestedASN) && requestedASN > start && requestedASN < end) {
      return [requestedASN];
    }
    throw new Errors.InvalidAsnRequestedForAllocation({ data: requestedASN });
  }

  private checkASNisValid(asn: StoredASN): boolean {
    const quarantinePeriod = moment().subtract(
      this.config.get<number>('QUARANTINE_PERIOD_MONTHS'),
      'months',
    );
    if (asn.resourceIds.length > 1) {
      this.logger.debug(
        `${asn.asn} was rejected for being in multiple Resources`,
      );
      return false;
    }
    if (asn.consoleIds.length > 1) {
      this.logger.debug(
        `${asn.asn} was rejected for being in multiple legacy ASN references`,
      );
      return false;
    }
    if (!asn.deallocatedAt) {
      this.logger.debug(`${asn.asn} was rejected as it is still allocated`);
      return false;
    }
    if (quarantinePeriod.isBefore(asn.deallocatedAt)) {
      this.logger.debug(`${asn.asn} was rejected for being in quarantine`);
      return false;
    }

    return true;
  }

  private async getValidASN(
    asns: number[],
    companyId: string,
  ): Promise<StoredASN> {
    const storedASNs = await this.asn.getASNs(asns);
    const unusedASNs = without(asns, ...map(storedASNs, 'asn'));
    if (!isEmpty(unusedASNs)) {
      return {
        asn: unusedASNs[0],
        private: true,
        status: 'VERIFIED',
        consoleIds: [],
        resourceIds: [],
        skipPrefixSync: true,
      };
    }

    const validASNs = storedASNs.filter((asn: StoredASN) =>
      this.checkASNisValid(asn),
    );
    if (isEmpty(validASNs)) {
      throw new Errors.NoUsableASNs();
    }

    const legacyASNIds: string[] = flatMap(validASNs, 'consoleIds');
    const usedInLegacyServices = map(
      await this.getGiaServicesForExistingASN(legacyASNIds),
      'asnId',
    );
    const asn = validASNs.find(({ consoleIds }) =>
      isEmpty(intersection(consoleIds, usedInLegacyServices)),
    );
    if (!asn) {
      throw new Errors.NoUsableASNs();
    }

    return asn;
  }

  private async getGiaServicesForExistingASN(
    asnIds: string[],
  ): Promise<LegacyIODServiceDto[]> {
    return this.shield.getGiaServices(
      new LoopbackFilter({
        where: {
          asnId: {
            inq: [...asnIds],
          },
        },
      }),
    );
  }
  public async deallocatePrivateASNById(resourceId: string) {
    const asnResource = await this.asn.getASNByResourceId(resourceId);
    if (!asnResource) {
      throw new Errors.NoUsableASNs();
    }
    await this.asn.deallocateAsn(asnResource);
  }
}
