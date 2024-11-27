import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { AxiosError, AxiosResponse } from 'axios';
import HttpStatusCodes from 'http-status-codes';

import {
  FAKE_ASN,
  FAKE_ASN_LEGACY,
  FAKE_OBJECT_ID,
  FAKE_UUID,
  FIRST_MAR_2020,
} from '@libs/nebula/testing/data/constants';
import { faker } from '@libs/nebula/testing/data/fakers';
import { ShieldApiService } from '@libs/nebula/Http/ShieldApi/shield-api.service';
import { LegacyASNDto } from '@libs/nebula/dto/legacy-api/legacy-asn.dto';
import { LoopbackFilter } from '@libs/nebula/Http/utils/LoopbackFilter';
import toDto from '@libs/nebula/utils/data/toDto';
import { LegacyUpdateASNDto } from '@libs/nebula/dto/legacy-api/legacy-update-asn.dto';
import { LegacyCreateASNDto } from '@libs/nebula/dto/legacy-api/legacy-create-asn.dto';
import Errors from '@libs/nebula/Error';

import { FAKE_STORED_ASN, FAKE_STORED_ASN_RESOURCE_META } from './test-data';
import { ConsoleASNStoreService } from './console-asn-store.service';

describe('ConsoleASNStoreService', () => {
  let service: ConsoleASNStoreService;
  let shield: DeepMocked<ShieldApiService>;
  const fakeAsnDto = faker(LegacyASNDto, {
    asn: FAKE_ASN_LEGACY,
    ...FAKE_STORED_ASN_RESOURCE_META,
    deallocatedAt: null,
  });
  const fakeStoredAsn = {
    ...FAKE_STORED_ASN,
    resourceIds: [],
  };
  const asns = [1234, 2345, 3456];
  const fakeStoredAsns = asns.map((asn) => ({ ...fakeStoredAsn, asn }));
  const fakeAsnDtos = asns.map((asn) =>
    faker(LegacyASNDto, {
      ...FAKE_STORED_ASN_RESOURCE_META,
      deallocatedAt: null,
      asn: asn.toString(),
    }),
  );

  beforeEach(() => {
    shield = createMock();
    service = new ConsoleASNStoreService(shield);
  });

  it('can fetch all console ASN records for a given ASN and present them as a unified view of the ASN', async () => {
    expect.hasAssertions();

    const expectedFilter = new LoopbackFilter({
      where: { asn: String(FAKE_ASN), private: false },
    });

    shield.getASNs.mockResolvedValue([fakeAsnDto]);

    expect(await service.getASN(FAKE_ASN)).toStrictEqual(fakeStoredAsn);

    expect(shield.getASNs).toBeCalledWith(expectedFilter);
  });

  it('can fetch all console ASN records for a given list of ASNs and present them as a unified view of the ASNs', async () => {
    expect.hasAssertions();

    const expectedFilter = new LoopbackFilter({
      where: { asn: { inq: asns }, private: false },
    });

    shield.getASNs.mockResolvedValue(fakeAsnDtos);

    expect(await service.getASNs(asns)).toStrictEqual(fakeStoredAsns);

    expect(shield.getASNs).toBeCalledWith(expectedFilter);
  });

  it('can fetch all console ASN records for a given private ASN and present them as a unified view of the ASN', async () => {
    expect.hasAssertions();

    const expectedFilter = new LoopbackFilter({
      where: { asn: String(FAKE_ASN), private: true },
    });

    shield.getASNs.mockResolvedValue([fakeAsnDto]);

    expect(await service.getASN(FAKE_ASN, true)).toStrictEqual(fakeStoredAsn);

    expect(shield.getASNs).toBeCalledWith(expectedFilter);
  });

  it('can fetch all console ASN records for a given list of private ASNs and present them as a unified view of the ASNs', async () => {
    expect.hasAssertions();

    const expectedFilter = new LoopbackFilter({
      where: { asn: { inq: asns }, private: true },
    });

    shield.getASNs.mockResolvedValue(fakeAsnDtos);

    expect(await service.getASNs(asns, true)).toStrictEqual(fakeStoredAsns);

    expect(shield.getASNs).toBeCalledWith(expectedFilter);
  });

  it('can update prefix sync metadata for a given ASN', async () => {
    expect.hasAssertions();

    await service.updatePrefixSyncMetadata(fakeStoredAsn, {
      ipPrefixLastCheckedAt: FIRST_MAR_2020,
    });

    expect(shield.updateASN).toBeCalledWith(
      FAKE_UUID,
      toDto(
        {
          ipPrefixLastCheckedAt: FIRST_MAR_2020,
        },
        LegacyUpdateASNDto,
      ),
    );
  });

  it('can allocate a given private ASN to a given company', async () => {
    expect.hasAssertions();

    shield.createASN.mockResolvedValue(faker(LegacyASNDto));
    const asnToAllocate = { ...fakeStoredAsn, consoleIds: [] };

    await service.allocatePrivateAsn(asnToAllocate, FAKE_OBJECT_ID);

    expect(asnToAllocate.consoleIds).toStrictEqual([FAKE_UUID]);

    expect(shield.createASN).toBeCalledWith(
      toDto(
        {
          companyId: FAKE_OBJECT_ID,
          private: true,
          asn: FAKE_ASN,
          status: 'VERIFIED',
          deallocatedAt: null,
        },
        LegacyCreateASNDto,
      ),
    );
  });

  it('can reallocate a given private ASN to a given company', async () => {
    expect.hasAssertions();

    const asnToAllocate = { ...fakeStoredAsn };

    await service.allocatePrivateAsn(asnToAllocate, FAKE_OBJECT_ID);

    expect(shield.updateASN).toBeCalledWith(
      FAKE_UUID,
      toDto(
        {
          companyId: FAKE_OBJECT_ID,
          private: true,
          asn: FAKE_ASN,
          status: 'VERIFIED',
          deallocatedAt: null,
        },
        LegacyUpdateASNDto,
      ),
    );
  });

  it('can deallocate a given private ASN', async () => {
    expect.hasAssertions();

    await service.deallocateAsn(fakeStoredAsn);

    expect(shield.updateASN).toBeCalledWith(FAKE_UUID, {
      deallocatedAt: expect.any(Date),
    });
  });

  it('should throw an error when no asn can be found', async () => {
    expect.hasAssertions();

    shield.getASNById.mockRejectedValue(
      new AxiosError(
        undefined,
        undefined,
        undefined,
        undefined,
        createMock<AxiosResponse>({ status: HttpStatusCodes.NOT_FOUND }),
      ),
    );

    await expect(service.getASNByConsoleId(FAKE_UUID)).rejects.toThrow(
      Errors.ASNNotFound,
    );
    expect(shield.getASNById).toHaveBeenCalledWith(FAKE_UUID);
  });
});
