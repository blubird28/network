import { Injectable } from '@nestjs/common';

import { CreateIoDResourceRequestDto } from '@libs/nebula/dto/network/create-iod-resource-request.dto';
import {
  CapabilityType,
  UsageType,
  ResourceType,
} from '@libs/nebula/Network/constants';

import { Resource } from '../resource/resource.entity';
import { ResourceService } from '../resource/resource.service';
import { ResourceTransactionService } from '../resource/resource-transaction.service';
import { CapabilityService } from '../resource/capability.service';

@Injectable()
export class IoDService {
  constructor(
    private readonly resourceTransactions: ResourceTransactionService,
    private readonly resources: ResourceService,
    private readonly capabilityService: CapabilityService,
  ) {}

  public async createIoDResource({
    vlanId,
    rate,
    giaSiteUuid,
    ipv4LinknetResourceId,
    ipv4PublicResourceId,
    ipv6LinknetResourceId,
    ipv6PublicResourceId,
    asnResourceId,
    slPortUuid,
  }: CreateIoDResourceRequestDto): Promise<Resource> {
    const usages = [];

    if (ipv4LinknetResourceId) {
      const ipv4LinknetCapability =
        await this.capabilityService.getCapabilityByResourceAndType(
          ipv4LinknetResourceId,
          CapabilityType.IP_ADDRESSES,
        );
      usages.push({
        capabilityId: ipv4LinknetCapability.id,
        type: UsageType.LINKNET_IP,
        amount: 1,
      });
    }

    if (ipv4PublicResourceId) {
      const ipv4PublicCapability =
        await this.capabilityService.getCapabilityByResourceAndType(
          ipv4PublicResourceId,
          CapabilityType.IP_ADDRESSES,
        );
      usages.push({
        capabilityId: ipv4PublicCapability.id,
        type: UsageType.PUBLIC_IP,
        amount: 1,
      });
    }

    if (ipv6LinknetResourceId) {
      const ipv6LinknetCapability =
        await this.capabilityService.getCapabilityByResourceAndType(
          ipv6LinknetResourceId,
          CapabilityType.IP_ADDRESSES,
        );
      usages.push({
        capabilityId: ipv6LinknetCapability.id,
        type: UsageType.LINKNET_IP,
        amount: 1,
      });
    }

    if (ipv6PublicResourceId) {
      const ipv6PublicCapability =
        await this.capabilityService.getCapabilityByResourceAndType(
          ipv6PublicResourceId,
          CapabilityType.IP_ADDRESSES,
        );
      usages.push({
        capabilityId: ipv6PublicCapability.id,
        type: UsageType.PUBLIC_IP,
        amount: 1,
      });
    }

    if (asnResourceId) {
      const asnCapability =
        await this.capabilityService.getCapabilityByResourceAndType(
          asnResourceId,
          CapabilityType.ASN,
        );
      usages.push({
        capabilityId: asnCapability.id,
        type: UsageType.ASN,
        amount: null,
      });
    }

    return this.resourceTransactions.createResourceTransaction({
      type: ResourceType.IOD_SITE,
      sourceId: giaSiteUuid,
      usages,
      meta: {
        vlanId,
        rate,
        slPortUuid,
      },
    });
  }

  private deleteIoDResource(resource: Resource): Promise<void> {
    return this.resourceTransactions.removeResourceTransaction(resource);
  }

  public async deleteIoDService(resourceId: string): Promise<void> {
    const resource: Resource = await this.resources.findOneByTypeAndId(
      ResourceType.IOD_SITE,
      resourceId,
    );
    await this.deleteIoDResource(resource);
  }
}
