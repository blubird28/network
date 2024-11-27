import { createMock, DeepMocked } from '@golevelup/ts-jest';

import { HttpStatus } from '@nestjs/common';

import { ResourceIdDto } from '@libs/nebula/dto/network/resource-id.dto';
import { faker } from '@libs/nebula/testing/data/fakers';
import {
  FAKE_ASN,
  FAKE_OBJECT_ID,
  FAKE_UUID,
} from '@libs/nebula/testing/data/constants';
import { ASNParamDto } from '@libs/nebula/dto/network/asn-param.dto';
import { ServiceLayerCallbackDto } from '@libs/nebula/dto/network/service-layer-callback.dto';
import { AllocatePrivateASNRequestDto } from '@libs/nebula/dto/network/assign-private-asn-request.dto';
import { AllocatePrivateASNResponseDto } from '@libs/nebula/dto/network/assign-private-asn-response.dto';
import { GetPublicASNRequestDto } from '@libs/nebula/dto/network/get-public-asn-request.dto';
import { GetPublicASNResponseDto } from '@libs/nebula/dto/network/get-public-asn-response.dto';

import { FAKE_STORED_ASN, FAKE_STORED_PRIVATE_ASN } from './test-data';
import { ASNStoreService } from './asn-store.service';
import { ASNController } from './asn.controller';
import { PrivateASNService } from './private-asn.service';
import { PrefixSyncService } from './prefix-sync.service';

describe('ASN Controller', () => {
  let controller: ASNController;
  let store: DeepMocked<ASNStoreService>;
  let sync: DeepMocked<PrefixSyncService>;
  let privateAsn: DeepMocked<PrivateASNService>;

  beforeEach(() => {
    store = createMock();
    sync = createMock();
    privateAsn = createMock();
    controller = new ASNController(sync, store, privateAsn);
  });

  it('syncs ASNs given a resource ID', async () => {
    expect.hasAssertions();

    store.getASNByResourceId.mockResolvedValue(FAKE_STORED_ASN);

    await controller.syncASNPrefixesByResourceId(faker(ResourceIdDto));

    expect(store.getASNByResourceId).toBeCalledWith(FAKE_UUID);
    expect(sync.syncStoredASN).toBeCalledWith(FAKE_STORED_ASN, true);
  });
  it('receives a callback from SL after prefixes are synced', async () => {
    expect.hasAssertions();

    store.getASN.mockResolvedValue(FAKE_STORED_ASN);

    await controller.syncASNCallback(
      faker(ASNParamDto),
      faker(ServiceLayerCallbackDto),
    );

    expect(store.getASN).toBeCalledWith(FAKE_ASN);
    expect(sync.syncASNCallback).toBeCalledWith(
      FAKE_STORED_ASN,
      HttpStatus.OK,
      'Success',
    );
  });

  it('allocates a private ASN and returns a resource ID', async () => {
    expect.hasAssertions();

    privateAsn.allocatePrivateAsn.mockResolvedValue(FAKE_STORED_PRIVATE_ASN);

    const request = faker(AllocatePrivateASNRequestDto);
    const expectedResponse = faker(AllocatePrivateASNResponseDto);

    const response = await controller.allocatePrivateASN(request);
    expect(privateAsn.allocatePrivateAsn).toBeCalledWith(
      FAKE_OBJECT_ID,
      false,
      FAKE_ASN,
    );
    expect(response).toStrictEqual(expectedResponse);
  });

  it('deletes a private asn', async () => {
    expect.hasAssertions();

    const request = faker(ResourceIdDto);

    await controller.deallocatePrivateASN(request);

    expect(privateAsn.deallocatePrivateASNById).toBeCalledWith(FAKE_UUID);
  });

  it('returns a resource ID and ASN number when requesting a public ASN', async () => {
    expect.hasAssertions();

    store.getPublicASNByConsoleId.mockResolvedValue(FAKE_STORED_ASN);

    const request = faker(GetPublicASNRequestDto);
    const expectedResponse = faker(GetPublicASNResponseDto);

    const response = await controller.getPublicASN(request);
    expect(store.getPublicASNByConsoleId).toBeCalledWith(FAKE_UUID);
    expect(response).toStrictEqual(expectedResponse);
  });
});
