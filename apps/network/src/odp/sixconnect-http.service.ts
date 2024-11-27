import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SixconnectSmartAssignRequestDto } from '@libs/nebula/dto/network/sixconnect-smart-assign-request.dto';
import { serializeResponse } from '@libs/nebula/Http/utils/serializeResponse';
import { SixconnectSmartAssignResponseDto } from '@libs/nebula/dto/network/sixconnect-smart-assign-response.dto';
import { RIRs } from '@libs/nebula/Network/constants';
import toDto from '@libs/nebula/utils/data/toDto';
import { SixconnectSmartAssignRequestWithRirDto } from '@libs/nebula/dto/network/sixconnect-smart-assign-request-with-rir.dto';
import cleanAxiosError from '@libs/nebula/utils/data/cleanAxiosError';
import Errors from '@libs/nebula/Error';
import { IpBlockType } from '@libs/nebula/dto/network/assign-ip-block-request.dto';
import { urlTemplate } from '@libs/nebula/Http/utils/urlTemplate';
import { SixconnectUpdateIpBlockMetaRequestDto } from '@libs/nebula/dto/network/sixconnect-update-ip-block-meta-request.dto';

import { SixConnectConfig } from '../config/schemas/six-connect.schema';

import { isIpBlockNotAvailableError } from './utils';
import { OdpHttpService } from './odp-http.service';

@Injectable()
export class SixconnectHttpService extends HttpService {
  private readonly logger: Logger = new Logger(SixconnectHttpService.name);

  constructor(
    @Inject(OdpHttpService) odp: OdpHttpService,
    @Inject(ConfigService)
    private readonly config: ConfigService<SixConnectConfig>,
  ) {
    super(odp.getAxiosInstance());
  }
  smartAssignLinknetIpBlockFromFirstAvailableRir(
    type: IpBlockType,
    mask: number,
  ): Promise<SixconnectSmartAssignResponseDto> {
    return this.smartAssignIpBlockFromFirstAvailableRir(
      this.getLinknetSixconnectSmartAssignConfig(type, mask),
    );
  }
  smartAssignPublicIpBlockFromFirstAvailableRir(
    type: IpBlockType,
    mask: number,
  ): Promise<SixconnectSmartAssignResponseDto> {
    return this.smartAssignIpBlockFromFirstAvailableRir(
      this.getPublicSixconnectSmartAssignConfig(type, mask),
    );
  }

  /**
   * Unassign a given sixconnect ipblock resource, releasing it back into the pool of usable ip blocks
   * @example { sourceId: 1234, meta1: "iod-uuid", meta2: "provisioningStateId", meta3: "companyId", meta4: "<cidr>,<country>,,<city>," }
   * @default { sourceId, meta1: "", meta2: "", meta3: "", meta4: ",,,," }
   */
  async unassignIpBlock({ id }): Promise<void> {
    await lastValueFrom(
      this.put(
        urlTemplate('/api/6connect/ipam/netblocks/:id/unassign', { id }),
        {
          skip_holding: true,
        },
      ),
    );
  }

  /**
   * Update metadata for a given sixconnect ipblock resource
   * @example { sourceId: 12345, meta1: "order-id", meta2: "business-key", meta3: "company-id", meta4: "<cidr>,<country>,,<city>," }
   * @default { sourceId, meta1: "", meta2: "", meta3: "", meta4: ",,,," }
   */
  async updateIpBlockMetadata(
    payload: SixconnectUpdateIpBlockMetaRequestDto,
  ): Promise<void> {
    await lastValueFrom(
      this.patch(
        urlTemplate('/api/6connect/ipam/netblocks/:id', { id: payload.id }),
        {
          ...(payload.meta1 !== undefined && { meta1: payload.meta1 }),
          ...(payload.meta2 !== undefined && { meta2: payload.meta2 }),
          ...(payload.meta3 !== undefined && { meta3: payload.meta3 }),
          ...(payload.meta4 !== undefined && { meta4: payload.meta4 }),
        },
      ),
    );
  }

  private smartAssignIpBlock(
    payload: SixconnectSmartAssignRequestDto,
  ): Promise<SixconnectSmartAssignResponseDto> {
    return lastValueFrom(
      this.put('/api/6connect/ipam/netblocks/smart_assign', payload).pipe(
        serializeResponse(SixconnectSmartAssignResponseDto),
      ),
    );
  }

  private async smartAssignIpBlockFromFirstAvailableRir(
    payload: SixconnectSmartAssignRequestDto,
  ): Promise<SixconnectSmartAssignResponseDto> {
    for (const rir of RIRs) {
      try {
        this.logger.debug(
          `Attempting to smart assign ip block with type ${this.smartAssignPayloadLogMessage(
            payload,
          )} in RIR: ${rir}...`,
        );
        const payloadWithRir = toDto(
          {
            ...payload,
            rir,
          },
          SixconnectSmartAssignRequestWithRirDto,
        );
        return await this.smartAssignIpBlock(payloadWithRir);
      } catch (err) {
        if (isIpBlockNotAvailableError(err)) {
          this.logger.debug(
            `Failed to find ip block with type ${this.smartAssignPayloadLogMessage(
              payload,
            )} in RIR: ${rir}`,
          );
        } else {
          throw cleanAxiosError(err);
        }
      }
    }
    throw new Errors.NoSuitableIpBlocks({
      type: payload.type,
      mask: payload.mask,
      tags: payload.tags,
    });
  }

  private getLinknetSixconnectSmartAssignConfig(
    type: IpBlockType,
    mask: number,
  ): SixconnectSmartAssignRequestDto {
    return toDto(
      {
        tags: this.config.get('SIXCONNECT_LINKNET_TAGS'),
        assigned_resource_id: this.config.get(
          'SIXCONNECT_LINKNET_ASSIGNED_RESOURCE_ID',
        ),
        resource_id: this.config.get('SIXCONNECT_LINKNET_RESOURCE_ID'),
        tags_mode: 'strict',
        type,
        mask,
      },
      SixconnectSmartAssignRequestDto,
    );
  }

  private getPublicSixconnectSmartAssignConfig(
    type: IpBlockType,
    mask: number,
  ): SixconnectSmartAssignRequestDto {
    return toDto(
      {
        tags: this.config.get('SIXCONNECT_PUBLIC_TAGS'),
        assigned_resource_id: this.config.get(
          'SIXCONNECT_PUBLIC_ASSIGNED_RESOURCE_ID',
        ),
        resource_id: this.config.get('SIXCONNECT_PUBLIC_RESOURCE_ID'),
        tags_mode: 'strict',
        type,
        mask,
      },
      SixconnectSmartAssignRequestDto,
    );
  }

  private smartAssignPayloadLogMessage(
    payload: SixconnectSmartAssignRequestDto,
  ): string {
    return `type ${payload.type}; mask ${payload.mask}; tags: ${payload.tags}`;
  }
}
