import { createMock, DeepMocked } from '@golevelup/ts-jest';

import { ConfigService } from '@nestjs/config';

import { faker } from '@libs/nebula/testing/data/fakers';
import { ShieldApiService } from '@libs/nebula/Http/ShieldApi/shield-api.service';
import {
  FAKE_ASN,
  FAKE_OBJECT_ID,
  FAKE_UUID,
  FIRST_JAN_2020,
} from '@libs/nebula/testing/data/constants';
import { LegacyIODServiceDto } from '@libs/nebula/dto/legacy-api/legacy-iod-service.dto';
import Errors from '@libs/nebula/Error';
import { MockerBuilder } from '@libs/nebula/testing/mocker/mocker.builder';

import { PrivateASNConfig } from '../config/schemas/private-asn.schema';

import { PrivateASNService } from './private-asn.service';
import { ASNStoreService } from './asn-store.service';
import { FAKE_STORED_PRIVATE_ASN } from './test-data';
import { StoredASN } from './asn.interfaces';

describe('PrivateASNSService', () => {
  let service: PrivateASNService;
  let ASNStoreService: DeepMocked<ASNStoreService>;
  let shield: DeepMocked<ShieldApiService>;
  let configService: ConfigService<PrivateASNConfig>;

  const fakeResourceId = '30a012ea-8520-402e-b5ae-5b159bc9027b';
  const fakeIOD = faker(LegacyIODServiceDto, {
    id: FAKE_UUID,
    companyId: FAKE_OBJECT_ID,
    asnId: FAKE_UUID,
    status: 'DELETED',
  });

  const fakeASNs = [0, 1, 2, 3, 4, 5, 60556];
  const generatorAmt = 20;
  const quarantinePeriod = 3;
  const fakeASNrangeStart = 60000;
  const fakeASNrangeEnd = 60600;

  const fakeStoredAsns: StoredASN[] = fakeASNs.map((asnNumber) => {
    return {
      ...FAKE_STORED_PRIVATE_ASN,
      asn: asnNumber,
      consoleIds: [FAKE_UUID],
      resourceIds: [FAKE_UUID],
    };
  });

  beforeEach(async () => {
    configService = MockerBuilder.mockConfigService<PrivateASNConfig>({
      PRIVATE_ASN_RANGE_START: fakeASNrangeStart,
      PRIVATE_ASN_RANGE_END: fakeASNrangeEnd,
      PRIVATE_ASN_AMT_TO_GENERATE: generatorAmt,
      QUARANTINE_PERIOD_MONTHS: quarantinePeriod,
    });
    shield = createMock<ShieldApiService>();
    ASNStoreService = createMock<ASNStoreService>();
    service = new PrivateASNService(ASNStoreService, shield, configService);
  });

  it('allocates suggested private asn', async () => {
    expect.hasAssertions();

    const validASN: StoredASN = {
      ...FAKE_STORED_PRIVATE_ASN,
      deallocatedAt: FIRST_JAN_2020,
    };

    ASNStoreService.getASNs.mockResolvedValue([validASN]);
    ASNStoreService.allocatePrivateAsn.mockResolvedValue(validASN);

    const response = await service.allocatePrivateAsn(
      FAKE_OBJECT_ID,
      false,
      FAKE_ASN,
    );

    expect(ASNStoreService.allocatePrivateAsn).toBeCalledWith(
      validASN,
      FAKE_OBJECT_ID,
    );
    expect(response).toStrictEqual(validASN);
  });

  it('allocates generated private asn', async () => {
    expect.hasAssertions();

    ASNStoreService.getASNs.mockResolvedValue(fakeStoredAsns);
    ASNStoreService.allocatePrivateAsn.mockResolvedValue(
      FAKE_STORED_PRIVATE_ASN,
    );

    const response = await service.allocatePrivateAsn(FAKE_OBJECT_ID);

    expect(response).toStrictEqual(FAKE_STORED_PRIVATE_ASN);
  });

  it('ignores suggested asn due to AutoAssign and allocates generated private asn', async () => {
    expect.hasAssertions();

    ASNStoreService.getASNs.mockResolvedValue(fakeStoredAsns);
    ASNStoreService.allocatePrivateAsn.mockResolvedValue(
      FAKE_STORED_PRIVATE_ASN,
    );

    const response = await service.allocatePrivateAsn(
      FAKE_OBJECT_ID,
      true,
      FAKE_ASN,
    );

    expect(ASNStoreService.allocatePrivateAsn).not.toBeCalledWith(
      FAKE_STORED_PRIVATE_ASN,
      FAKE_OBJECT_ID,
    );
    expect(response).not.toBeUndefined();
  });

  it('generates suggested asns', () => {
    expect.hasAssertions();

    const response = service.getSuggestedASNs();

    expect(response.length).toStrictEqual(generatorAmt);
    const outliers = response.filter(
      (x) => x > fakeASNrangeEnd || x < fakeASNrangeStart,
    );
    expect(outliers.length).toStrictEqual(0);
  });

  it('allocates suggested private asn that was deallocated in Shield more than 3 months ago', async () => {
    expect.hasAssertions();

    const fakeASNDeallocated: StoredASN = {
      ...FAKE_STORED_PRIVATE_ASN,
      deallocatedAt: FIRST_JAN_2020,
    };

    ASNStoreService.getASNs.mockResolvedValue([fakeASNDeallocated]);
    ASNStoreService.allocatePrivateAsn.mockResolvedValue({
      ...fakeASNDeallocated,
      resourceIds: [FAKE_UUID],
    });

    const response = await service.allocatePrivateAsn(
      FAKE_OBJECT_ID,
      false,
      FAKE_ASN,
    );
    expect(response).toStrictEqual(fakeASNDeallocated);
  });

  it('cannot generate suggested asns', () => {
    expect.hasAssertions();

    expect(() => service.getSuggestedASNs(0)).toThrowError(
      Errors.InvalidAsnRequestedForAllocation,
    );
    expect(() => service.getSuggestedASNs(100000000)).toThrowError(
      Errors.InvalidAsnRequestedForAllocation,
    );
    expect(() => service.getSuggestedASNs(-1)).toThrowError(
      Errors.InvalidAsnRequestedForAllocation,
    );
  });

  it('cannot allocate suggested private asn as it is invalid ', () => {
    expect.hasAssertions();
    expect(
      service.allocatePrivateAsn(FAKE_OBJECT_ID, false, 0),
    ).rejects.toThrowError(Errors.InvalidAsnRequestedForAllocation);
  });

  it('cannot allocate private asn as companyId is null', () => {
    expect.hasAssertions();
    expect(service.allocatePrivateAsn(null)).rejects.toThrowError(
      Errors.InvalidCompanyId,
    );
  });

  it('cannot allocate suggested private asn as it was in multiple Resources', async () => {
    expect.hasAssertions();

    const fakeASNStoreWithTooManyResources =
      fakeStoredAsns[fakeStoredAsns.length - 1];
    fakeASNStoreWithTooManyResources.resourceIds = [FAKE_UUID, fakeResourceId];
    ASNStoreService.getASNs.mockResolvedValue([
      fakeASNStoreWithTooManyResources,
    ]);

    expect(
      service.allocatePrivateAsn(FAKE_OBJECT_ID, false, FAKE_ASN),
    ).rejects.toThrowError(Errors.NoUsableASNs);
  });

  it('cannot allocate suggested private asn as it is still in use', () => {
    expect.hasAssertions();

    ASNStoreService.getASNs.mockResolvedValue([FAKE_STORED_PRIVATE_ASN]);
    expect(
      service.allocatePrivateAsn(FAKE_OBJECT_ID, false, FAKE_ASN),
    ).rejects.toThrowError(Errors.NoUsableASNs);
  });

  it('cannot allocate suggested private asn as it was in multiple Console Items', () => {
    expect.hasAssertions();

    const fakeASNMultipleConsoleItems: StoredASN = {
      ...FAKE_STORED_PRIVATE_ASN,
      consoleIds: [FAKE_UUID, FAKE_UUID],
    };

    ASNStoreService.getASNs.mockResolvedValue([fakeASNMultipleConsoleItems]);
    expect(
      service.allocatePrivateAsn(FAKE_OBJECT_ID, false, FAKE_ASN),
    ).rejects.toThrowError(Errors.NoUsableASNs);
  });

  it('cannot allocate suggested private asn as it was deallocated in Shield less than 3 months ago', () => {
    expect.hasAssertions();

    const fakeASNNotDeallocated: StoredASN = {
      ...FAKE_STORED_PRIVATE_ASN,
      deallocatedAt: new Date(Date.now()),
    };

    ASNStoreService.getASNs.mockResolvedValue([fakeASNNotDeallocated]);
    expect(
      service.allocatePrivateAsn(FAKE_OBJECT_ID, false, FAKE_ASN),
    ).rejects.toThrowError(Errors.NoUsableASNs);
  });

  it('cannot allocate suggested private asn as it has a console Id being used in a Gia service', () => {
    expect.hasAssertions();

    const fakeASNwithConsoleIdInGia = {
      ...FAKE_STORED_PRIVATE_ASN,
      consoleIds: [FAKE_UUID],
    };
    ASNStoreService.getASNs.mockResolvedValue([fakeASNwithConsoleIdInGia]);
    shield.getGiaServices.mockResolvedValue([fakeIOD]);

    expect(
      service.allocatePrivateAsn(FAKE_OBJECT_ID, false, FAKE_ASN),
    ).rejects.toThrow(Errors.NoUsableASNs);
  });

  it('can delete private asn', async () => {
    expect.hasAssertions();

    const validASN: StoredASN = {
      ...FAKE_STORED_PRIVATE_ASN,
      deallocatedAt: FIRST_JAN_2020,
    };

    ASNStoreService.getASNByResourceId.mockResolvedValue(
      FAKE_STORED_PRIVATE_ASN,
    );
    ASNStoreService.getASNs.mockResolvedValue([validASN]);

    await service.deallocatePrivateASNById(FAKE_UUID);
    expect(ASNStoreService.getASNByResourceId).toBeCalledWith(FAKE_UUID);
    expect(ASNStoreService.deallocateAsn).toBeCalledWith(
      FAKE_STORED_PRIVATE_ASN,
    );
  });

  it('cannot delete private asn since no matches can be found', async () => {
    expect.hasAssertions();

    ASNStoreService.getASNByResourceId.mockResolvedValue(undefined);

    await expect(
      service.deallocatePrivateASNById(FAKE_UUID),
    ).rejects.toThrowError(Errors.NoUsableASNs);
  });
});
