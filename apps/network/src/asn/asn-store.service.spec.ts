import { createMock, DeepMocked } from '@golevelup/ts-jest';

import {
  FAKE_ASN,
  FAKE_OBJECT_ID,
  FAKE_UUID,
  FIRST_MAR_2020,
} from '@libs/nebula/testing/data/constants';
import { faker } from '@libs/nebula/testing/data/fakers';
import { LegacyASNDto } from '@libs/nebula/dto/legacy-api/legacy-asn.dto';
import Errors from '@libs/nebula/Error';

import { ResourceASNStoreService } from './resource-asn-store.service';
import { FAKE_STORED_ASN } from './test-data';
import { ConsoleASNStoreService } from './console-asn-store.service';
import { ASNStoreService } from './asn-store.service';

describe('ASNStoreService', () => {
  let service: ASNStoreService;
  let console: DeepMocked<ConsoleASNStoreService>;
  let resource: DeepMocked<ResourceASNStoreService>;
  const fakeConsoleStoredAsn = { ...FAKE_STORED_ASN, resourceIds: [] };
  const fakeResourceStoredAsn = { ...FAKE_STORED_ASN, consoleIds: [] };
  const asns = [1234, 2345, 3456];
  const fakeStoredAsns = asns.map((asn) => ({ ...FAKE_STORED_ASN, asn }));
  const fakeConsoleStoredAsns = asns.map((asn) => ({
    ...FAKE_STORED_ASN,
    resourceIds: [],
    asn,
  }));
  const fakeResourceStoredAsns = asns.map((asn) => ({
    ...FAKE_STORED_ASN,
    consoleIds: [],
    asn,
  }));

  beforeEach(() => {
    console = createMock();
    resource = createMock();
    service = new ASNStoreService(console, resource);
  });

  it('can fetch all ASN records from console and Resources for a given ASN and present them as a unified view of the ASN', async () => {
    expect.hasAssertions();

    console.getASN.mockResolvedValue(fakeConsoleStoredAsn);
    resource.getASN.mockResolvedValue(fakeResourceStoredAsn);

    expect(await service.getASN(FAKE_ASN)).toStrictEqual(FAKE_STORED_ASN);

    expect(console.getASN).toBeCalledWith(FAKE_ASN, false);
    expect(resource.getASN).toBeCalledWith(FAKE_ASN, false);
  });

  it('can fetch all ASN records from console and Resources for a given list of ASNs and present them as a unified view of the ASNs', async () => {
    expect.hasAssertions();

    console.getASNs.mockResolvedValue(fakeConsoleStoredAsns);
    resource.getASNs.mockResolvedValue(fakeResourceStoredAsns);

    expect(await service.getASNs(asns)).toStrictEqual(fakeStoredAsns);

    expect(console.getASNs).toBeCalledWith(asns, false);
    expect(resource.getASNs).toBeCalledWith(asns, false);
  });

  it('can fetch all ASN records from console and Resources for a given private ASN and present them as a unified view of the ASN', async () => {
    expect.hasAssertions();

    console.getASN.mockResolvedValue(fakeConsoleStoredAsn);
    resource.getASN.mockResolvedValue(fakeResourceStoredAsn);

    expect(await service.getASN(FAKE_ASN, true)).toStrictEqual(FAKE_STORED_ASN);

    expect(console.getASN).toBeCalledWith(FAKE_ASN, true);
    expect(resource.getASN).toBeCalledWith(FAKE_ASN, true);
  });

  it('can fetch all ASN records from console and Resources for a given list of private ASNs and present them as a unified view of the ASN', async () => {
    expect.hasAssertions();

    console.getASNs.mockResolvedValue(fakeConsoleStoredAsns);
    resource.getASNs.mockResolvedValue(fakeResourceStoredAsns);

    expect(await service.getASNs(asns, true)).toStrictEqual(fakeStoredAsns);

    expect(console.getASNs).toBeCalledWith(asns, true);
    expect(resource.getASNs).toBeCalledWith(asns, true);
  });

  it('can update prefix sync metadata in all sources for a given ASN', async () => {
    expect.hasAssertions();

    await service.updatePrefixSyncMetadata(FAKE_STORED_ASN, {
      ipPrefixLastCheckedAt: FIRST_MAR_2020,
    });

    expect(console.updatePrefixSyncMetadata).toBeCalledWith(FAKE_STORED_ASN, {
      ipPrefixLastCheckedAt: FIRST_MAR_2020,
    });
    expect(resource.updatePrefixSyncMetadata).toBeCalledWith(FAKE_STORED_ASN, {
      ipPrefixLastCheckedAt: FIRST_MAR_2020,
    });
  });

  it('can allocate a given private asn', async () => {
    expect.hasAssertions();

    console.allocatePrivateAsn.mockResolvedValue(FAKE_STORED_ASN);
    resource.allocatePrivateAsn.mockResolvedValue(FAKE_STORED_ASN);

    expect(
      await service.allocatePrivateAsn(FAKE_STORED_ASN, FAKE_OBJECT_ID),
    ).toStrictEqual(FAKE_STORED_ASN);

    expect(console.allocatePrivateAsn).toBeCalledWith(
      FAKE_STORED_ASN,
      FAKE_OBJECT_ID,
    );
    expect(resource.allocatePrivateAsn).toBeCalledWith(
      FAKE_STORED_ASN,
      FAKE_OBJECT_ID,
    );
  });

  it('can delete a given private asn', async () => {
    expect.hasAssertions();

    await service.deallocateAsn(FAKE_STORED_ASN);
    expect(console.deallocateAsn).toBeCalledWith(FAKE_STORED_ASN);
    expect(resource.deallocateAsn).toBeCalledWith(FAKE_STORED_ASN);
  });

  it('cannot deallocate an asn because it is not private', async () => {
    expect.hasAssertions();

    const asnNotPrivate = { ...FAKE_STORED_ASN, private: false };

    await expect(service.deallocateAsn(asnNotPrivate)).rejects.toThrowError(
      Errors.CannotDeallocatePublicASN,
    );
  });

  it('cannot deallocate an asn because it has >1 associated resource', async () => {
    expect.hasAssertions();

    const asnNotPrivate = {
      ...FAKE_STORED_ASN,
      private: true,
      resourceIds: [FAKE_UUID, FAKE_UUID],
    };

    await expect(service.deallocateAsn(asnNotPrivate)).rejects.toThrowError(
      Errors.DuplicatePrivateASN,
    );
  });

  it('cannot deallocate an asn because it has >1 console id', async () => {
    expect.hasAssertions();

    const asnNotPrivate = {
      ...FAKE_STORED_ASN,
      private: true,
      consoleIds: [FAKE_UUID, FAKE_UUID],
    };

    await expect(service.deallocateAsn(asnNotPrivate)).rejects.toThrowError(
      Errors.DuplicatePrivateASN,
    );
  });

  it('should get a public asn and call to allocate the public asn on the resource store', async () => {
    expect.hasAssertions();

    console.getASNByConsoleId.mockResolvedValue(faker(LegacyASNDto));
    console.toStoredASN.mockReturnValue(FAKE_STORED_ASN);
    resource.allocatePublicAsn.mockResolvedValue(FAKE_STORED_ASN);

    expect(await service.getPublicASNByConsoleId(FAKE_UUID)).toStrictEqual(
      FAKE_STORED_ASN,
    );
    expect(resource.allocatePublicAsn).toHaveBeenCalledWith(
      FAKE_STORED_ASN,
      FAKE_OBJECT_ID,
    );
  });
});
