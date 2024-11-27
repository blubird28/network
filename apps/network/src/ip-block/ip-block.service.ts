import IPCIDR from 'ip-cidr';

import { Injectable } from '@nestjs/common';

import { AssignIpBlockRequestDto } from '@libs/nebula/dto/network/assign-ip-block-request.dto';
import { CapabilityType, ResourceType } from '@libs/nebula/Network/constants';
import Errors from '@libs/nebula/Error';
import { SerializedObject } from '@libs/nebula/Serialization/serializes';
import { SixconnectUpdateIpBlockMetaRequestDto } from '@libs/nebula/dto/network/sixconnect-update-ip-block-meta-request.dto';
import toDto from '@libs/nebula/utils/data/toDto';
import { UpdateIpBlockMetaRequestDto } from '@libs/nebula/dto/network/update-ip-block-meta-request.dto';

import { ResourceTransactionService } from '../resource/resource-transaction.service';
import { Resource } from '../resource/resource.entity';
import { SixconnectHttpService } from '../odp/sixconnect-http.service';
import { ResourceService } from '../resource/resource.service';

@Injectable()
export class IpBlockService {
  constructor(
    private readonly resourceTransactions: ResourceTransactionService,
    private readonly sixconnect: SixconnectHttpService,
    private readonly resources: ResourceService,
  ) {}

  public async assignLinknetIp({
    type,
    mask,
  }: AssignIpBlockRequestDto): Promise<Resource> {
    const { id, cidr } =
      await this.sixconnect.smartAssignLinknetIpBlockFromFirstAvailableRir(
        type,
        mask,
      );
    const [consoleRouterIp, customerRouterIp] = this.getRouterIpsFromCidr(cidr);
    return this.createIpBlockResource(id, cidr, {
      consoleRouterIp,
      customerRouterIp,
    });
  }

  public async assignPublicIp({
    type,
    mask,
  }: AssignIpBlockRequestDto): Promise<Resource> {
    const { id, cidr } =
      await this.sixconnect.smartAssignPublicIpBlockFromFirstAvailableRir(
        type,
        mask,
      );
    return this.createIpBlockResource(id, cidr);
  }

  public async updateIpBlockMetaData(
    resourceId: string,
    metadata: UpdateIpBlockMetaRequestDto,
  ): Promise<void> {
    const { orderId, businessKey, companyId, geolocation } = metadata;

    const resource: Resource = await this.resources.findOneByTypeAndId(
      ResourceType.IP_BLOCK,
      resourceId,
    );

    await this.sixconnect.updateIpBlockMetadata(
      toDto(
        {
          id: resource.sourceId,
          meta1: metadata.orderId,
          meta2: metadata.businessKey,
          meta3: metadata.companyId,
          ...(metadata.geolocation && { meta4: metadata.geolocation }),
        },
        SixconnectUpdateIpBlockMetaRequestDto,
      ),
    );

    return this.updateIpBlockResourceMetadata(resource.id, {
      ...resource.meta,
      orderId,
      businessKey,
      companyId,
      geolocation,
    });
  }

  private createIpBlockResource(
    sixconnectId: number,
    cidr: string,
    additionalMeta: SerializedObject = {},
  ): Promise<Resource> {
    return this.resourceTransactions.createResourceTransaction({
      type: ResourceType.IP_BLOCK,
      sourceId: String(sixconnectId),
      meta: {
        cidr,
        ...additionalMeta,
      },
      capabilities: {
        type: CapabilityType.IP_ADDRESSES,
        limit: 1,
      },
    });
  }

  private getRouterIpsFromCidr(cidr: string): [string, string] {
    const ipCidr = new IPCIDR(cidr);

    const addresses = ipCidr.toArray();
    if (addresses.length === 2) {
      return [addresses[0], addresses[1]];
    } else if (addresses.length >= 4) {
      return [addresses[1], addresses[2]];
    }
    throw new Errors.InvalidLinknetSize();
  }

  private updateIpBlockResourceMetadata(
    resourceId: string,
    metadata: SerializedObject,
  ): Promise<void> {
    return this.resources.updateResourceById(resourceId, { meta: metadata });
  }

  private deleteIpBlockResource(resource: Resource): Promise<void> {
    return this.resourceTransactions.removeResourceTransaction(resource);
  }

  public async unassignIpBlock(resourceId): Promise<void> {
    const resource: Resource = await this.resources.findOneByTypeAndId(
      ResourceType.IP_BLOCK,
      resourceId,
    );

    if (resource.isBeingUsed()) {
      throw new Errors.ResourceIsBeingUsed({ id: resource.id });
    }

    await this.sixconnect.updateIpBlockMetadata(
      toDto(
        {
          id: resource.sourceId,
          meta1: '',
          meta2: '',
          meta3: '',
          meta4: ',,,,',
        },
        SixconnectUpdateIpBlockMetaRequestDto,
      ),
    );
    await this.sixconnect.unassignIpBlock({ id: resource.sourceId });
    return this.deleteIpBlockResource(resource);
  }
}
