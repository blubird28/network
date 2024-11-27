import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { omit } from 'lodash';

import {
  AssignIpBlockRequestDto,
  IpBlockType,
} from '@libs/nebula/dto/network/assign-ip-block-request.dto';
import { faker } from '@libs/nebula/testing/data/fakers';
import { CapabilityType, ResourceType } from '@libs/nebula/Network/constants';
import { SixconnectSmartAssignResponseDto } from '@libs/nebula/dto/network/sixconnect-smart-assign-response.dto';
import Errors from '@libs/nebula/Error';
import { UpdateIpBlockMetaRequestDto } from '@libs/nebula/dto/network/update-ip-block-meta-request.dto';

import { Resource } from '../resource/resource.entity';
import { ResourceTransactionService } from '../resource/resource-transaction.service';
import { SixconnectHttpService } from '../odp/sixconnect-http.service';
import { ResourceService } from '../resource/resource.service';

import { IpBlockService } from './ip-block.service';

describe('IpBlockService', () => {
  let service: IpBlockService;
  let sixconnect: DeepMocked<SixconnectHttpService>;
  let resourceTransactions: DeepMocked<ResourceTransactionService>;
  let resources: DeepMocked<ResourceService>;

  const id = 12345;
  const linknetMask = 31;
  const linknetCidr = '10.0.0.1/31';
  const linknetRequestDto = faker(AssignIpBlockRequestDto, {
    type: IpBlockType.ipv4,
    mask: linknetMask,
  });
  const linknetResponseDto = faker(SixconnectSmartAssignResponseDto, {
    id,
    cidr: linknetCidr,
  });
  const consoleRouterIp = '10.0.0.0';
  const customerRouterIp = '10.0.0.1';
  const linknetResource = faker(Resource, {
    type: ResourceType.IP_BLOCK,
    sourceId: String(id),
    meta: {
      cidr: linknetCidr,
      consoleRouterIp,
      customerRouterIp,
    },
  });
  const publicCidr = '10.0.0.1/24';
  const publicMask = 24;
  const publicRequestDto = faker(AssignIpBlockRequestDto, {
    type: IpBlockType.ipv4,
    mask: publicMask,
  });
  const publicResponseDto = faker(SixconnectSmartAssignResponseDto, {
    id,
    cidr: publicCidr,
  });
  const publicResource = faker(Resource, {
    type: ResourceType.IP_BLOCK,
    sourceId: String(id),
    meta: {
      cidr: publicCidr,
    },
  });
  const updateMetaRequestDto = faker(UpdateIpBlockMetaRequestDto);

  beforeEach(() => {
    resources = createMock<ResourceService>();
    resourceTransactions = createMock<ResourceTransactionService>();
    sixconnect = createMock<SixconnectHttpService>();
    service = new IpBlockService(resourceTransactions, sixconnect, resources);
  });

  it('assigns a linknet ip block', async () => {
    expect.hasAssertions();

    sixconnect.smartAssignLinknetIpBlockFromFirstAvailableRir.mockResolvedValue(
      linknetResponseDto,
    );
    resourceTransactions.createResourceTransaction.mockResolvedValue(
      linknetResource,
    );

    expect(await service.assignLinknetIp(linknetRequestDto)).toStrictEqual(
      linknetResource,
    );
    expect(
      sixconnect.smartAssignLinknetIpBlockFromFirstAvailableRir,
    ).toBeCalledWith(IpBlockType.ipv4, linknetMask);
    expect(resourceTransactions.createResourceTransaction).toBeCalledWith({
      type: ResourceType.IP_BLOCK,
      sourceId: String(id),
      meta: {
        cidr: linknetCidr,
        consoleRouterIp,
        customerRouterIp,
      },
      capabilities: {
        type: CapabilityType.IP_ADDRESSES,
        limit: 1,
      },
    });
  });

  it('assigns a public ip block', async () => {
    expect.hasAssertions();

    sixconnect.smartAssignPublicIpBlockFromFirstAvailableRir.mockResolvedValue(
      publicResponseDto,
    );
    resourceTransactions.createResourceTransaction.mockResolvedValue(
      publicResource,
    );

    expect(await service.assignPublicIp(publicRequestDto)).toStrictEqual(
      publicResource,
    );
    expect(
      sixconnect.smartAssignPublicIpBlockFromFirstAvailableRir,
    ).toBeCalledWith(IpBlockType.ipv4, publicMask);
    expect(resourceTransactions.createResourceTransaction).toBeCalledWith({
      type: ResourceType.IP_BLOCK,
      sourceId: String(id),
      meta: {
        cidr: publicCidr,
      },
      capabilities: {
        type: CapabilityType.IP_ADDRESSES,
        limit: 1,
      },
    });
  });

  it('fails to assign a linknet block with an unexpected size', async () => {
    expect.hasAssertions();

    sixconnect.smartAssignLinknetIpBlockFromFirstAvailableRir.mockResolvedValue(
      faker(SixconnectSmartAssignResponseDto, { id, cidr: '10.0.0.1/32' }),
    );

    await expect(
      service.assignLinknetIp(linknetRequestDto),
    ).rejects.toThrowError(Errors.InvalidLinknetSize);
    expect(
      sixconnect.smartAssignLinknetIpBlockFromFirstAvailableRir,
    ).toBeCalledWith(IpBlockType.ipv4, linknetMask);
  });

  it('updates meta on an ip block', async () => {
    expect.hasAssertions();

    const ipBlockResource = publicResource;
    resources.findOneByTypeAndId.mockResolvedValue(ipBlockResource);
    sixconnect.updateIpBlockMetadata.mockResolvedValue(undefined);
    resources.updateResourceById.mockResolvedValue();

    await service.updateIpBlockMetaData(
      ipBlockResource.id,
      updateMetaRequestDto,
    );

    expect(resources.findOneByTypeAndId).toHaveBeenCalledWith(
      ResourceType.IP_BLOCK,
      ipBlockResource.id,
    );
    expect(sixconnect.updateIpBlockMetadata).toHaveBeenCalledWith({
      id: ipBlockResource.sourceId,
      meta1: updateMetaRequestDto.orderId,
      meta2: updateMetaRequestDto.businessKey,
      meta3: updateMetaRequestDto.companyId,
      meta4: updateMetaRequestDto.geolocation,
    });
    expect(resources.updateResourceById).toHaveBeenCalledWith(
      ipBlockResource.id,
      {
        meta: {
          cidr: ipBlockResource.meta.cidr,
          consoleRouterIp: ipBlockResource.meta.consoleRouterIp,
          customerRouterIp: ipBlockResource.meta.customerRouterIp,
          ...updateMetaRequestDto,
        },
      },
    );
  });

  it('updates meta on an ip block with no geolocation in request', async () => {
    expect.hasAssertions();

    const ipBlockResource = publicResource;
    resources.findOneByTypeAndId.mockResolvedValue(ipBlockResource);
    sixconnect.updateIpBlockMetadata.mockResolvedValue(undefined);
    resources.updateResourceById.mockResolvedValue();

    await service.updateIpBlockMetaData(
      ipBlockResource.id,
      omit(updateMetaRequestDto, ['geolocation']),
    );

    expect(resources.findOneByTypeAndId).toHaveBeenCalledWith(
      ResourceType.IP_BLOCK,
      ipBlockResource.id,
    );
    expect(sixconnect.updateIpBlockMetadata).toHaveBeenCalledWith({
      id: ipBlockResource.sourceId,
      meta1: updateMetaRequestDto.orderId,
      meta2: updateMetaRequestDto.businessKey,
      meta3: updateMetaRequestDto.companyId,
    });
    expect(resources.updateResourceById).toHaveBeenCalledWith(
      ipBlockResource.id,
      {
        meta: {
          cidr: ipBlockResource.meta.cidr,
          consoleRouterIp: ipBlockResource.meta.consoleRouterIp,
          customerRouterIp: ipBlockResource.meta.customerRouterIp,
          ...omit(updateMetaRequestDto, ['geolocation']),
        },
      },
    );
  });

  it('unassigns an ip block', async () => {
    expect.hasAssertions();

    const ipBlockResource = publicResource;
    resources.findOneByTypeAndId.mockResolvedValue(ipBlockResource);
    sixconnect.updateIpBlockMetadata.mockResolvedValue(undefined);
    sixconnect.unassignIpBlock.mockResolvedValue(undefined);
    resourceTransactions.removeResourceTransaction.mockResolvedValue();

    await service.unassignIpBlock(ipBlockResource.id);

    expect(resources.findOneByTypeAndId).toHaveBeenCalledWith(
      ResourceType.IP_BLOCK,
      ipBlockResource.id,
    );
    expect(sixconnect.updateIpBlockMetadata).toHaveBeenCalledWith({
      id: ipBlockResource.sourceId,
      meta1: '',
      meta2: '',
      meta3: '',
      meta4: ',,,,',
    });
    expect(sixconnect.unassignIpBlock).toHaveBeenCalledWith({
      id: ipBlockResource.sourceId,
    });
    expect(resourceTransactions.removeResourceTransaction).toHaveBeenCalledWith(
      ipBlockResource,
    );
  });
});
