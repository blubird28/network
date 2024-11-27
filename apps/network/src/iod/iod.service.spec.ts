import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';

import { faker } from '@libs/nebula/testing/data/fakers';
import {
  CapabilityType,
  ResourceType,
  UsageType,
} from '@libs/nebula/Network/constants';
import { CreateIoDResourceRequestDto } from '@libs/nebula/dto/network/create-iod-resource-request.dto';
import Errors from '@libs/nebula/Error';

import { Resource } from '../resource/resource.entity';
import { ResourceTransactionService } from '../resource/resource-transaction.service';
import { CapabilityService } from '../resource/capability.service';
import { Capability } from '../resource/capability.entity';
import { Usage } from '../resource/usage.entity';
import { ResourceService } from '../resource/resource.service';

import { IoDService } from './iod.service';

describe('IoDService', () => {
  let service: IoDService;
  let resources: DeepMocked<ResourceService>;
  let resourceTransactions: DeepMocked<ResourceTransactionService>;
  let capabilityService: DeepMocked<CapabilityService>;

  const vlanId = 1234;
  const rate = 100;
  const giaSiteUuid = 'gia-site-uuid';
  const slPortUuid = 'sl-port-uuid';
  const ipv4LinknetResourceId = 'ipv4-linknet-resource-id';
  const ipv4PublicResourceId = 'ipv4-public-resource-id';
  const ipv6LinknetResourceId = 'ipv6-linknet-resource-id';
  const ipv6PublicResourceId = 'ipv6-public-resource-id';
  const asnResourceId = 'asn-resource-id';

  const requestDto = faker(CreateIoDResourceRequestDto, {
    vlanId,
    rate,
    giaSiteUuid,
    slPortUuid,
    ipv4LinknetResourceId,
    ipv4PublicResourceId,
    ipv6LinknetResourceId,
    ipv6PublicResourceId,
    asnResourceId,
  });

  const ipv4LinknetCapability = faker(Capability, {
    id: ipv4LinknetResourceId,
    type: CapabilityType.IP_ADDRESSES,
  });

  const ipv4PublicCapability = faker(Capability, {
    id: ipv4PublicResourceId,
    type: CapabilityType.IP_ADDRESSES,
  });

  const ipv6LinknetCapability = faker(Capability, {
    id: ipv6LinknetResourceId,
    type: CapabilityType.IP_ADDRESSES,
  });

  const ipv6PublicCapability = faker(Capability, {
    id: ipv6PublicResourceId,
    type: CapabilityType.IP_ADDRESSES,
  });

  const asnCapability = faker(Capability, {
    id: asnResourceId,
    type: CapabilityType.ASN,
  });

  const iodResource = faker(Resource, {
    type: ResourceType.IOD_SITE,
    sourceId: giaSiteUuid,
    meta: { vlanId, rate, slPortUuid },
    usages: [
      faker(Usage, {
        capability: ipv4LinknetCapability,
        type: UsageType.LINKNET_IP,
        amount: 1,
      }),
      faker(Usage, {
        capability: ipv4PublicCapability,
        type: UsageType.PUBLIC_IP,
        amount: 1,
      }),
      faker(Usage, {
        capability: ipv6LinknetCapability,
        type: UsageType.LINKNET_IP,
        amount: 1,
      }),
      faker(Usage, {
        capability: ipv6PublicCapability,
        type: UsageType.PUBLIC_IP,
        amount: 1,
      }),
      faker(Usage, {
        capability: asnCapability,
        type: UsageType.ASN,
        amount: null,
      }),
    ],
  });

  beforeEach(() => {
    resourceTransactions = createMock<ResourceTransactionService>();
    resources = createMock<ResourceService>();
    capabilityService = createMock<CapabilityService>();

    service = new IoDService(
      resourceTransactions,
      resources,
      capabilityService,
    );
  });

  it('creates an IoD resource with valid capabilities', async () => {
    expect.hasAssertions();

    capabilityService.getCapabilityByResourceAndType
      .mockResolvedValueOnce(ipv4LinknetCapability)
      .mockResolvedValueOnce(ipv4PublicCapability)
      .mockResolvedValueOnce(ipv6LinknetCapability)
      .mockResolvedValueOnce(ipv6PublicCapability)
      .mockResolvedValueOnce(asnCapability);

    resourceTransactions.createResourceTransaction.mockResolvedValueOnce(
      iodResource,
    );

    expect(await service.createIoDResource(requestDto)).toStrictEqual(
      iodResource,
    );

    expect(
      capabilityService.getCapabilityByResourceAndType,
    ).toHaveBeenNthCalledWith(
      1,
      ipv4LinknetResourceId,
      CapabilityType.IP_ADDRESSES,
    );

    expect(
      capabilityService.getCapabilityByResourceAndType,
    ).toHaveBeenNthCalledWith(
      2,
      ipv4PublicResourceId,
      CapabilityType.IP_ADDRESSES,
    );

    expect(
      capabilityService.getCapabilityByResourceAndType,
    ).toHaveBeenNthCalledWith(
      3,
      ipv6LinknetResourceId,
      CapabilityType.IP_ADDRESSES,
    );

    expect(
      capabilityService.getCapabilityByResourceAndType,
    ).toHaveBeenNthCalledWith(
      4,
      ipv6PublicResourceId,
      CapabilityType.IP_ADDRESSES,
    );

    expect(
      capabilityService.getCapabilityByResourceAndType,
    ).toHaveBeenNthCalledWith(5, asnResourceId, CapabilityType.ASN);

    expect(resourceTransactions.createResourceTransaction).toBeCalledWith({
      type: ResourceType.IOD_SITE,
      sourceId: giaSiteUuid,
      usages: [
        {
          capabilityId: ipv4LinknetCapability.id,
          type: UsageType.LINKNET_IP,
          amount: 1,
        },
        {
          capabilityId: ipv4PublicCapability.id,
          type: UsageType.PUBLIC_IP,
          amount: 1,
        },
        {
          capabilityId: ipv6LinknetCapability.id,
          type: UsageType.LINKNET_IP,
          amount: 1,
        },
        {
          capabilityId: ipv6PublicCapability.id,
          type: UsageType.PUBLIC_IP,
          amount: 1,
        },
        {
          capabilityId: asnCapability.id,
          type: UsageType.ASN,
          amount: null,
        },
      ],
      meta: { vlanId, rate, slPortUuid },
    });
  });

  it('deletes an IoD resource without usages', async () => {
    expect.hasAssertions();
    resources.findOneByTypeAndId.mockResolvedValue(iodResource);
    resourceTransactions.removeResourceTransaction.mockResolvedValue(undefined);

    await service.deleteIoDService(iodResource.id);

    expect(resources.findOneByTypeAndId).toHaveBeenCalledWith(
      ResourceType.IOD_SITE,
      iodResource.id,
    );
    expect(resourceTransactions.removeResourceTransaction).toHaveBeenCalledWith(
      iodResource,
    );
  });

  it('fails when a required capability is not found', async () => {
    expect.hasAssertions();

    capabilityService.getCapabilityByResourceAndType.mockRejectedValueOnce(
      new Errors.NotFound(),
    );

    await expect(service.createIoDResource(requestDto)).rejects.toThrow(
      Errors.NotFound,
    );

    expect(capabilityService.getCapabilityByResourceAndType).toBeCalledWith(
      ipv4LinknetResourceId,
      CapabilityType.IP_ADDRESSES,
    );
  });
});
