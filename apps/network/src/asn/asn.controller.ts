import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

import { ServiceLayerCallbackDto } from '@libs/nebula/dto/network/service-layer-callback.dto';
import { ResourceIdDto } from '@libs/nebula/dto/network/resource-id.dto';
import { ASNParamDto } from '@libs/nebula/dto/network/asn-param.dto';
import { AllocatePrivateASNRequestDto } from '@libs/nebula/dto/network/assign-private-asn-request.dto';
import { AllocatePrivateASNResponseDto } from '@libs/nebula/dto/network/assign-private-asn-response.dto';
import toDto from '@libs/nebula/utils/data/toDto';
import { GetPublicASNRequestDto } from '@libs/nebula/dto/network/get-public-asn-request.dto';
import { GetPublicASNResponseDto } from '@libs/nebula/dto/network/get-public-asn-response.dto';

import {
  REST_ASN_PREFIX,
  REST_ASN_PRIVATE_ALLOCATE,
  REST_ASN_PRIVATE_DEALLOCATE,
  REST_ASN_PUBLIC_GET,
  REST_SYNC_ASN_BY_RESOURCE_ID_PATH,
  REST_SYNC_ASN_SL_CALLBACK_PATH,
} from './constants';
import { PrefixSyncService } from './prefix-sync.service';
import { ASNStoreService } from './asn-store.service';
import { PrivateASNService } from './private-asn.service';

@Controller(REST_ASN_PREFIX)
export class ASNController {
  constructor(
    private readonly prefixSync: PrefixSyncService,
    private readonly asns: ASNStoreService,
    private readonly privateAsn: PrivateASNService,
  ) {}

  @Post(REST_SYNC_ASN_BY_RESOURCE_ID_PATH)
  @HttpCode(HttpStatus.OK)
  async syncASNPrefixesByResourceId(
    @Param() { id }: ResourceIdDto,
  ): Promise<void> {
    const asn = await this.asns.getASNByResourceId(id);
    await this.prefixSync.syncStoredASN(asn, true);
  }

  @Post(REST_SYNC_ASN_SL_CALLBACK_PATH)
  @HttpCode(HttpStatus.OK)
  async syncASNCallback(
    @Param() { asn }: ASNParamDto,
    @Body() { code, message }: ServiceLayerCallbackDto,
  ): Promise<void> {
    const storedAsn = await this.asns.getASN(asn);
    await this.prefixSync.syncASNCallback(storedAsn, code, message);
  }

  @Post(REST_ASN_PRIVATE_ALLOCATE)
  async allocatePrivateASN(
    @Body() body: AllocatePrivateASNRequestDto,
  ): Promise<AllocatePrivateASNResponseDto> {
    const storedASN = await this.privateAsn.allocatePrivateAsn(
      body.companyId,
      body.autoAssign,
      body.asn,
    );
    return toDto(
      { resourceId: storedASN.resourceIds[0], asn: storedASN.asn },
      AllocatePrivateASNResponseDto,
    );
  }

  @Post(REST_ASN_PRIVATE_DEALLOCATE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deallocatePrivateASN(@Param() { id }: ResourceIdDto): Promise<void> {
    await this.privateAsn.deallocatePrivateASNById(id);
  }

  @Post(REST_ASN_PUBLIC_GET)
  async getPublicASN(
    @Body() { asnId }: GetPublicASNRequestDto,
  ): Promise<GetPublicASNResponseDto> {
    const publicASN = await this.asns.getPublicASNByConsoleId(asnId);
    return toDto(
      { resourceId: publicASN.resourceIds[0], asn: publicASN.asn },
      GetPublicASNResponseDto,
    );
  }
}
