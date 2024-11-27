import nock from 'nock';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { createMock } from '@golevelup/ts-jest';

import { faker } from '@libs/nebula/testing/data/fakers';
import { SixconnectSmartAssignResponseDto } from '@libs/nebula/dto/network/sixconnect-smart-assign-response.dto';
import { MockerBuilder } from '@libs/nebula/testing/mocker/mocker.builder';
import { IpBlockType } from '@libs/nebula/dto/network/assign-ip-block-request.dto';
import { RIR, RIRs } from '@libs/nebula/Network/constants';
import Errors from '@libs/nebula/Error';

import { SixConnectConfig } from '../config/schemas/six-connect.schema';

import { OdpHttpService } from './odp-http.service';
import { SixconnectHttpService } from './sixconnect-http.service';

describe('SixconnectHttpService', () => {
  let service: SixconnectHttpService;
  let scope: nock.Scope;
  const apiUrl = 'https://test-api.url';
  const id = 12345;
  const linknetMask = 31;
  const baseLinknetRequest = {
    rir: RIR.ARIN,
    type: IpBlockType.ipv4,
    mask: linknetMask,
    resource_id: 123,
    assigned_resource_id: 234,
    tags_mode: 'strict',
    tags: 'linknet',
  };
  const linknetCidr = '10.0.0.1/31';
  const linknetResponse = { id, cidr: linknetCidr };
  const expectedLinknetResponseDto = faker(SixconnectSmartAssignResponseDto);
  const publicMask = 24;
  const basePublicRequest = {
    rir: RIR.ARIN,
    type: IpBlockType.ipv4,
    mask: publicMask,
    resource_id: 345,
    assigned_resource_id: 456,
    tags_mode: 'strict',
    tags: 'public',
  };
  const publicCidr = '10.0.0.1/24';
  const publicResponse = { id, cidr: publicCidr };
  const expectedPublicResponseDto = faker(SixconnectSmartAssignResponseDto, {
    cidr: publicCidr,
  });
  const smartAssignPath = '/api/6connect/ipam/netblocks/smart_assign';
  const noSuitableBlocks = { message: 'No suitable blocks found' };

  beforeEach(async () => {
    const odp = createMock<OdpHttpService>({
      getAxiosInstance: () => axios.create({ baseURL: apiUrl }),
    });
    service = new SixconnectHttpService(
      odp,
      MockerBuilder.mockConfigService<SixConnectConfig>({
        SIXCONNECT_LINKNET_RESOURCE_ID: 123,
        SIXCONNECT_LINKNET_ASSIGNED_RESOURCE_ID: 234,
        SIXCONNECT_LINKNET_TAGS: 'linknet',
        SIXCONNECT_PUBLIC_RESOURCE_ID: 345,
        SIXCONNECT_PUBLIC_ASSIGNED_RESOURCE_ID: 456,
        SIXCONNECT_PUBLIC_TAGS: 'public',
      }),
    );
    scope = nock(apiUrl);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('calls to smart assign a linknet IP block from 6connect', async () => {
    expect.hasAssertions();
    scope
      .put(smartAssignPath, baseLinknetRequest)
      .reply(StatusCodes.OK, linknetResponse);
    const result = await service.smartAssignLinknetIpBlockFromFirstAvailableRir(
      IpBlockType.ipv4,
      linknetMask,
    );

    expect(result).toStrictEqual(expectedLinknetResponseDto);
    expect(scope.isDone()).toBe(true);
  });

  it('calls to smart assign a linknet IP block from 6connect and fails over through RIRs till it finds an IP block', async () => {
    expect.hasAssertions();

    const [lastRir, ...rirs] = [...RIRs].reverse();
    rirs.forEach((rir) => {
      scope
        .put(smartAssignPath, {
          ...baseLinknetRequest,
          rir,
        })
        .reply(StatusCodes.NOT_FOUND, noSuitableBlocks);
    });

    scope
      .put(smartAssignPath, {
        ...baseLinknetRequest,
        rir: lastRir,
      })
      .reply(StatusCodes.OK, linknetResponse);

    const result = await service.smartAssignLinknetIpBlockFromFirstAvailableRir(
      IpBlockType.ipv4,
      linknetMask,
    );

    expect(result).toStrictEqual(expectedLinknetResponseDto);
    expect(scope.isDone()).toBe(true);
  });

  it('calls to smart assign a linknet IP block from 6connect and returns the expected error if no RIR has an available block', async () => {
    expect.hasAssertions();

    RIRs.forEach((rir) => {
      scope
        .put(smartAssignPath, {
          ...baseLinknetRequest,
          rir,
        })
        .reply(StatusCodes.NOT_FOUND, noSuitableBlocks);
    });

    await expect(
      service.smartAssignLinknetIpBlockFromFirstAvailableRir(
        IpBlockType.ipv4,
        linknetMask,
      ),
    ).rejects.toThrowError(Errors.NoSuitableIpBlocks);

    expect(scope.isDone()).toBe(true);
  });

  it('calls to smart assign a linknet IP block from 6connect and returns any other error directly', async () => {
    expect.hasAssertions();

    scope
      .put(smartAssignPath, baseLinknetRequest)
      .reply(StatusCodes.INTERNAL_SERVER_ERROR);

    await expect(
      service.smartAssignLinknetIpBlockFromFirstAvailableRir(
        IpBlockType.ipv4,
        linknetMask,
      ),
    ).rejects.toThrowError('Request failed with status code 500');

    expect(scope.isDone()).toBe(true);
  });

  it('calls to smart assign a public IP block from 6connect', async () => {
    expect.hasAssertions();
    scope
      .put(smartAssignPath, basePublicRequest)
      .reply(StatusCodes.OK, publicResponse);
    const result = await service.smartAssignPublicIpBlockFromFirstAvailableRir(
      IpBlockType.ipv4,
      publicMask,
    );

    expect(result).toStrictEqual(expectedPublicResponseDto);
    expect(scope.isDone()).toBe(true);
  });

  it('calls to smart assign a public IP block from 6connect and fails over through RIRs till it finds an IP block', async () => {
    expect.hasAssertions();

    const [lastRir, ...rirs] = [...RIRs].reverse();
    rirs.forEach((rir) => {
      scope
        .put(smartAssignPath, {
          ...basePublicRequest,
          rir,
        })
        .reply(StatusCodes.NOT_FOUND, noSuitableBlocks);
    });

    scope
      .put(smartAssignPath, {
        ...basePublicRequest,
        rir: lastRir,
      })
      .reply(StatusCodes.OK, publicResponse);

    const result = await service.smartAssignPublicIpBlockFromFirstAvailableRir(
      IpBlockType.ipv4,
      publicMask,
    );

    expect(result).toStrictEqual(expectedPublicResponseDto);
    expect(scope.isDone()).toBe(true);
  });

  it('calls to smart assign a public IP block from 6connect and returns the expected error if no RIR has an available block', async () => {
    expect.hasAssertions();

    RIRs.forEach((rir) => {
      scope
        .put(smartAssignPath, {
          ...basePublicRequest,
          rir,
        })
        .reply(StatusCodes.NOT_FOUND, noSuitableBlocks);
    });

    await expect(
      service.smartAssignPublicIpBlockFromFirstAvailableRir(
        IpBlockType.ipv4,
        publicMask,
      ),
    ).rejects.toThrowError(Errors.NoSuitableIpBlocks);

    expect(scope.isDone()).toBe(true);
  });

  it('calls to smart assign a public IP block from 6connect and returns any other error directly', async () => {
    expect.hasAssertions();

    scope
      .put(smartAssignPath, basePublicRequest)
      .reply(StatusCodes.INTERNAL_SERVER_ERROR);

    await expect(
      service.smartAssignPublicIpBlockFromFirstAvailableRir(
        IpBlockType.ipv4,
        publicMask,
      ),
    ).rejects.toThrowError('Request failed with status code 500');

    expect(scope.isDone()).toBe(true);
  });
});
