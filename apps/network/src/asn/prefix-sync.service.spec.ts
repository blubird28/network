import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { AxiosError } from 'axios';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { JsonContains } from 'typeorm';

import { HttpStatus } from '@nestjs/common';

import Errors from '@libs/nebula/Error';
import { FAKE_AS_SET, FAKE_ASN } from '@libs/nebula/testing/data/constants';
import { PrefixLookupResponseDto } from '@libs/nebula/dto/network/prefix-lookup-response.dto';
import { faker } from '@libs/nebula/testing/data/fakers';
import { ResourceType, UsageType } from '@libs/nebula/Network/constants';

import { PrefixLookupHttpService } from '../odp/prefix-lookup-http.service';
import { ServiceLayerHttpService } from '../service-layer/service-layer-http.service';
import { ResourceService } from '../resource/resource.service';
import { Resource } from '../resource/resource.entity';

import { ASNStoreService } from './asn-store.service';
import { PrefixSyncService } from './prefix-sync.service';
import { FAKE_STORED_ASN } from './test-data';
import { StoredASN } from './asn.interfaces';

describe('Prefix Sync Service', () => {
  let service: PrefixSyncService;
  let asns: DeepMocked<ASNStoreService>;
  let prefixLookup: DeepMocked<PrefixLookupHttpService>;
  let serviceLayer: DeepMocked<ServiceLayerHttpService>;
  let resources: DeepMocked<ResourceService>;
  const newIpv4Prefix = '10.1.2.0/24';
  const newIpv6Prefix = '2401:8800::/32';
  const expectedCallbackPath = `/asn/sync-asn-callback/${FAKE_ASN}`;
  const slSuccessMessage = 'Success';
  const slFailedMessage = 'Failure';
  const fake404 = new AxiosError(
    'Not Found',
    ReasonPhrases[StatusCodes.NOT_FOUND],
    null,
    null,
    {
      statusText: ReasonPhrases[StatusCodes.NOT_FOUND],
      config: null,
      headers: {},
      request: {},
      status: StatusCodes.NOT_FOUND,
      data: {
        message: 'Could not resolve hostname',
      },
    },
  );

  const fakeAsns: Record<string, StoredASN> = {
    notOnConsole: { ...FAKE_STORED_ASN, consoleIds: [] },
    notInResources: { ...FAKE_STORED_ASN, resourceIds: [] },
    private: { ...FAKE_STORED_ASN, private: true },
    skip: { ...FAKE_STORED_ASN, skipPrefixSync: true, private: false },
    asSet: { ...FAKE_STORED_ASN, asSet: FAKE_AS_SET, private: false },
    asn: { ...FAKE_STORED_ASN, asSet: null, private: false },
  };

  const fakeIpcResponses: Record<string, PrefixLookupResponseDto> = {
    noChanges: faker(PrefixLookupResponseDto),
    v4Changes: faker(PrefixLookupResponseDto, {
      ipv4: [newIpv4Prefix],
    }),
    v6Changes: faker(PrefixLookupResponseDto, {
      ipv6: [newIpv6Prefix],
    }),
    bothChanges: faker(PrefixLookupResponseDto, {
      ipv4: [newIpv4Prefix],
      ipv6: [newIpv6Prefix],
    }),
  };

  beforeEach(() => {
    asns = createMock();
    prefixLookup = createMock();
    serviceLayer = createMock();
    resources = createMock();
    service = new PrefixSyncService(
      asns,
      prefixLookup,
      serviceLayer,
      resources,
    );
  });

  it('throws CannotSyncASNNotReferenced if attempting to sync an ASN that is not found', async () => {
    expect.hasAssertions();

    await expect(service.syncStoredASN(null)).rejects.toThrow(
      Errors.CannotSyncASNNotReferenced,
    );

    expect(asns.updatePrefixSyncMetadata).not.toBeCalled();
    expect(prefixLookup.lookupASSetPrefixes).not.toBeCalled();
    expect(prefixLookup.lookupASNPrefixes).not.toBeCalled();
    expect(serviceLayer.updatePrefixSet).not.toBeCalled();
  });

  it('throws CannotSyncASNNotReferenced if attempting to sync an ASN that is not found in console', async () => {
    expect.hasAssertions();

    await expect(service.syncStoredASN(fakeAsns.notOnConsole)).rejects.toThrow(
      Errors.CannotSyncASNNotReferenced,
    );

    expect(asns.updatePrefixSyncMetadata).not.toBeCalled();
    expect(prefixLookup.lookupASSetPrefixes).not.toBeCalled();
    expect(prefixLookup.lookupASNPrefixes).not.toBeCalled();
    expect(serviceLayer.updatePrefixSet).not.toBeCalled();
  });

  it('throws CannotSyncASNNotReferenced if attempting to sync an ASN that is not found in resources', async () => {
    expect.hasAssertions();

    await expect(
      service.syncStoredASN(fakeAsns.notInResources),
    ).rejects.toThrow(Errors.CannotSyncASNNotReferenced);

    expect(asns.updatePrefixSyncMetadata).not.toBeCalled();
    expect(prefixLookup.lookupASSetPrefixes).not.toBeCalled();
    expect(prefixLookup.lookupASNPrefixes).not.toBeCalled();
    expect(serviceLayer.updatePrefixSet).not.toBeCalled();
  });

  it('throws CannotSyncPrivateASN if attempting to sync an ASN that is private', async () => {
    expect.hasAssertions();

    await expect(service.syncStoredASN(fakeAsns.private)).rejects.toThrow(
      Errors.CannotSyncPrivateASN,
    );

    expect(asns.updatePrefixSyncMetadata).not.toBeCalled();
    expect(prefixLookup.lookupASSetPrefixes).not.toBeCalled();
    expect(prefixLookup.lookupASNPrefixes).not.toBeCalled();
    expect(serviceLayer.updatePrefixSet).not.toBeCalled();
  });

  it('does not act or throw if attempting to sync an ASN that is set to skipPrefixSync', async () => {
    expect.hasAssertions();

    await service.syncStoredASN(fakeAsns.skip);

    expect(asns.updatePrefixSyncMetadata).not.toBeCalled();
    expect(prefixLookup.lookupASSetPrefixes).not.toBeCalled();
    expect(prefixLookup.lookupASNPrefixes).not.toBeCalled();
    expect(serviceLayer.updatePrefixSet).not.toBeCalled();
  });

  it('updates asn stores with error information if getting asn prefixes returns 404', async () => {
    expect.hasAssertions();

    prefixLookup.lookupASNPrefixes.mockRejectedValue(fake404);

    await expect(service.syncStoredASN(fakeAsns.asn)).rejects.toThrow(fake404);

    expect(prefixLookup.lookupASNPrefixes).toBeCalledWith(FAKE_ASN);
    expect(asns.updatePrefixSyncMetadata).toBeCalledWith(fakeAsns.asn, {
      ipPrefixLastCheckedAt: expect.any(Date),
      ipPrefixLastErrorAt: expect.any(Date),
      ipPrefixLastErrorReason: 'ASN was not found in PrefixLookup API',
    });
    expect(prefixLookup.lookupASSetPrefixes).not.toBeCalled();
    expect(serviceLayer.updatePrefixSet).not.toBeCalled();
  });

  it('updates asn stores with error information if getting as-set prefixes returns 404', async () => {
    expect.hasAssertions();

    prefixLookup.lookupASSetPrefixes.mockRejectedValue(fake404);

    await expect(service.syncStoredASN(fakeAsns.asSet)).rejects.toThrow(
      fake404,
    );

    expect(prefixLookup.lookupASSetPrefixes).toBeCalledWith(FAKE_AS_SET);
    expect(asns.updatePrefixSyncMetadata).toBeCalledWith(fakeAsns.asSet, {
      ipPrefixLastCheckedAt: expect.any(Date),
      ipPrefixLastErrorAt: expect.any(Date),
      ipPrefixLastErrorReason: 'AS-SET was not found in PrefixLookup API',
    });
    expect(prefixLookup.lookupASNPrefixes).not.toBeCalled();
    expect(serviceLayer.updatePrefixSet).not.toBeCalled();
  });

  it('fetches prefixes for the AS-Set rather than the ASN if there is one', async () => {
    expect.hasAssertions();

    prefixLookup.lookupASSetPrefixes.mockResolvedValue(
      fakeIpcResponses.noChanges,
    );

    await service.syncStoredASN(fakeAsns.asSet);

    expect(prefixLookup.lookupASSetPrefixes).toBeCalledWith(FAKE_AS_SET);
    expect(asns.updatePrefixSyncMetadata).toBeCalledWith(fakeAsns.asSet, {
      ipPrefixConfiguredInIPCV4: fakeIpcResponses.noChanges.ipv4,
      ipPrefixConfiguredInIPCV6: fakeIpcResponses.noChanges.ipv6,
      ipPrefixLastCheckedAt: expect.any(Date),
    });
    expect(prefixLookup.lookupASNPrefixes).not.toBeCalled();
    expect(serviceLayer.updatePrefixSet).not.toBeCalled();
  });

  it('sends changes to SL if there are changes in the ipv4 prefix lists', async () => {
    expect.hasAssertions();

    prefixLookup.lookupASNPrefixes.mockResolvedValue(
      fakeIpcResponses.v4Changes,
    );

    await service.syncStoredASN(fakeAsns.asn);

    expect(prefixLookup.lookupASNPrefixes).toBeCalledWith(FAKE_ASN);
    expect(asns.updatePrefixSyncMetadata).toBeCalledWith(fakeAsns.asn, {
      ipPrefixConfiguredInIPCV4: fakeIpcResponses.v4Changes.ipv4,
      ipPrefixConfiguredInIPCV6: fakeIpcResponses.v4Changes.ipv6,
      ipPrefixLastCheckedAt: expect.any(Date),
    });
    expect(asns.updatePrefixSyncMetadata).toBeCalledWith(fakeAsns.asn, {
      ipPrefixLastSLUpdateRequestAt: expect.any(Date),
    });
    expect(serviceLayer.updatePrefixSet).toBeCalledWith(
      FAKE_ASN,
      fakeIpcResponses.v4Changes.ipv4,
      fakeIpcResponses.v4Changes.ipv6,
      expectedCallbackPath,
    );
    expect(prefixLookup.lookupASSetPrefixes).not.toBeCalled();
  });

  it('sends changes to SL if there are changes in the ipv6 prefix lists', async () => {
    expect.hasAssertions();

    prefixLookup.lookupASNPrefixes.mockResolvedValue(
      fakeIpcResponses.v6Changes,
    );

    await service.syncStoredASN(fakeAsns.asn);

    expect(prefixLookup.lookupASNPrefixes).toBeCalledWith(FAKE_ASN);
    expect(asns.updatePrefixSyncMetadata).toBeCalledWith(fakeAsns.asn, {
      ipPrefixConfiguredInIPCV4: fakeIpcResponses.v6Changes.ipv4,
      ipPrefixConfiguredInIPCV6: fakeIpcResponses.v6Changes.ipv6,
      ipPrefixLastCheckedAt: expect.any(Date),
    });
    expect(asns.updatePrefixSyncMetadata).toBeCalledWith(fakeAsns.asn, {
      ipPrefixLastSLUpdateRequestAt: expect.any(Date),
    });
    expect(serviceLayer.updatePrefixSet).toBeCalledWith(
      FAKE_ASN,
      fakeIpcResponses.v6Changes.ipv4,
      fakeIpcResponses.v6Changes.ipv6,
      expectedCallbackPath,
    );
    expect(prefixLookup.lookupASSetPrefixes).not.toBeCalled();
  });

  it('sends changes to SL if force is enabled', async () => {
    expect.hasAssertions();

    prefixLookup.lookupASNPrefixes.mockResolvedValue(
      fakeIpcResponses.noChanges,
    );

    await service.syncStoredASN(fakeAsns.asn, true);

    expect(prefixLookup.lookupASNPrefixes).toBeCalledWith(FAKE_ASN);
    expect(asns.updatePrefixSyncMetadata).toBeCalledWith(fakeAsns.asn, {
      ipPrefixConfiguredInIPCV4: fakeIpcResponses.noChanges.ipv4,
      ipPrefixConfiguredInIPCV6: fakeIpcResponses.noChanges.ipv6,
      ipPrefixLastCheckedAt: expect.any(Date),
    });
    expect(asns.updatePrefixSyncMetadata).toBeCalledWith(fakeAsns.asn, {
      ipPrefixLastSLUpdateRequestAt: expect.any(Date),
    });
    expect(serviceLayer.updatePrefixSet).toBeCalledWith(
      FAKE_ASN,
      fakeIpcResponses.noChanges.ipv4,
      fakeIpcResponses.noChanges.ipv6,
      expectedCallbackPath,
    );
    expect(prefixLookup.lookupASSetPrefixes).not.toBeCalled();
  });

  it('does not send changes to SL if there are no changes and force is not enabled', async () => {
    expect.hasAssertions();

    prefixLookup.lookupASNPrefixes.mockResolvedValue(
      fakeIpcResponses.noChanges,
    );

    await service.syncStoredASN(fakeAsns.asn);

    expect(prefixLookup.lookupASNPrefixes).toBeCalledWith(FAKE_ASN);
    expect(asns.updatePrefixSyncMetadata).toBeCalledWith(fakeAsns.asn, {
      ipPrefixConfiguredInIPCV4: fakeIpcResponses.noChanges.ipv4,
      ipPrefixConfiguredInIPCV6: fakeIpcResponses.noChanges.ipv6,
      ipPrefixLastCheckedAt: expect.any(Date),
    });
    expect(asns.updatePrefixSyncMetadata).not.toBeCalledWith(fakeAsns.asn, {
      ipPrefixLastSLUpdateRequestAt: expect.any(Date),
    });
    expect(serviceLayer.updatePrefixSet).not.toBeCalled();
    expect(prefixLookup.lookupASSetPrefixes).not.toBeCalled();
  });

  it('updates ASN stores with error information if SL returns an error', async () => {
    expect.hasAssertions();

    const expectedError = new Error('Computer says no');
    prefixLookup.lookupASNPrefixes.mockResolvedValue(
      fakeIpcResponses.noChanges,
    );
    serviceLayer.updatePrefixSet.mockRejectedValue(expectedError);

    await expect(service.syncStoredASN(fakeAsns.asn, true)).rejects.toThrow(
      expectedError,
    );

    expect(prefixLookup.lookupASNPrefixes).toBeCalledWith(FAKE_ASN);
    expect(asns.updatePrefixSyncMetadata).toBeCalledWith(fakeAsns.asn, {
      ipPrefixConfiguredInIPCV4: fakeIpcResponses.noChanges.ipv4,
      ipPrefixConfiguredInIPCV6: fakeIpcResponses.noChanges.ipv6,
      ipPrefixLastCheckedAt: expect.any(Date),
    });
    expect(asns.updatePrefixSyncMetadata).not.toBeCalledWith(fakeAsns.asn, {
      ipPrefixLastSLUpdateRequestAt: expect.any(Date),
    });
    expect(asns.updatePrefixSyncMetadata).toBeCalledWith(fakeAsns.asn, {
      ipPrefixLastErrorAt: expect.any(Date),
      ipPrefixLastSLUpdateRequestAt: expect.any(Date),
      ipPrefixLastErrorReason: 'Computer says no',
    });
    expect(serviceLayer.updatePrefixSet).toBeCalledWith(
      FAKE_ASN,
      fakeIpcResponses.noChanges.ipv4,
      fakeIpcResponses.noChanges.ipv6,
      expectedCallbackPath,
    );
    expect(prefixLookup.lookupASSetPrefixes).not.toBeCalled();
  });

  it('throws CannotSyncASNNotReferenced if an SL callback is received for an ASN that is not found', async () => {
    expect.hasAssertions();

    await expect(
      service.syncASNCallback(null, HttpStatus.OK, slSuccessMessage),
    ).rejects.toThrow(Errors.CannotSyncASNNotReferenced);

    expect(asns.updatePrefixSyncMetadata).not.toBeCalled();
  });

  it('throws CannotSyncASNNotReferenced if an SL callback is received for an ASN that is not found in console', async () => {
    expect.hasAssertions();

    await expect(
      service.syncASNCallback(
        fakeAsns.notOnConsole,
        HttpStatus.OK,
        slSuccessMessage,
      ),
    ).rejects.toThrow(Errors.CannotSyncASNNotReferenced);

    expect(asns.updatePrefixSyncMetadata).not.toBeCalled();
  });

  it('throws CannotSyncASNNotReferenced if an SL callback is received for an ASN that is not found in resources', async () => {
    expect.hasAssertions();

    await expect(
      service.syncASNCallback(
        fakeAsns.notInResources,
        HttpStatus.OK,
        slSuccessMessage,
      ),
    ).rejects.toThrow(Errors.CannotSyncASNNotReferenced);

    expect(asns.updatePrefixSyncMetadata).not.toBeCalled();
  });

  it('throws CannotSyncPrivateASN if an SL callback is received for an ASN that is private', async () => {
    expect.hasAssertions();

    await expect(
      service.syncASNCallback(
        fakeAsns.private,
        HttpStatus.OK,
        slSuccessMessage,
      ),
    ).rejects.toThrow(Errors.CannotSyncPrivateASN);

    expect(asns.updatePrefixSyncMetadata).not.toBeCalled();
  });

  it('does not act or throw if an SL callback is received for an ASN that is set to skipPrefixSync', async () => {
    expect.hasAssertions();

    await service.syncASNCallback(
      fakeAsns.skip,
      HttpStatus.OK,
      slSuccessMessage,
    );

    expect(asns.updatePrefixSyncMetadata).not.toBeCalled();
  });

  it('updates ASN stores with the updated values if the SL callback contains a success code', async () => {
    expect.hasAssertions();

    serviceLayer.isSuccessCode.mockReturnValue(true);

    await service.syncASNCallback(
      fakeAsns.asn,
      HttpStatus.OK,
      slSuccessMessage,
    );

    expect(asns.updatePrefixSyncMetadata).toBeCalledWith(fakeAsns.asn, {
      ipPrefixLastSLUpdateSuccessAt: expect.any(Date),
      ipPrefixConfiguredInSLV4: fakeAsns.asn.ipPrefixConfiguredInIPCV4,
      ipPrefixConfiguredInSLV6: fakeAsns.asn.ipPrefixConfiguredInIPCV6,
    });
  });

  it('updates ASN stores with error information if the SL callback does not contain an error code', async () => {
    expect.hasAssertions();

    serviceLayer.isSuccessCode.mockReturnValue(false);

    await service.syncASNCallback(
      fakeAsns.asn,
      HttpStatus.BAD_REQUEST,
      slFailedMessage,
    );

    expect(asns.updatePrefixSyncMetadata).toBeCalledWith(fakeAsns.asn, {
      ipPrefixLastErrorAt: expect.any(Date),
      ipPrefixLastErrorReason: slFailedMessage,
    });
  });

  it('gets ASNs with active usage to sync', async () => {
    expect.hasAssertions();

    const fakeResource = faker(Resource, { sourceId: String(FAKE_ASN) });
    resources.findByActiveUsage.mockResolvedValue([fakeResource]);

    expect(await service.getASNsToSync()).toStrictEqual([FAKE_ASN]);

    expect(resources.findByActiveUsage).toBeCalledWith(UsageType.ASN, {
      type: ResourceType.ASN,
      meta: JsonContains({ private: false }),
    });
  });
});
