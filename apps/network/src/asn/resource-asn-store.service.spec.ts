import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { In, JsonContains } from 'typeorm';

import {
  FAKE_ASN,
  FAKE_OBJECT_ID,
  FAKE_UUID,
  FIRST_MAR_2020,
} from '@libs/nebula/testing/data/constants';
import { faker } from '@libs/nebula/testing/data/fakers';
import { CapabilityType, ResourceType } from '@libs/nebula/Network/constants';

import { Resource } from '../resource/resource.entity';
import { ResourceService } from '../resource/resource.service';
import { ResourceTransactionService } from '../resource/resource-transaction.service';
import { Capability } from '../resource/capability.entity';
import { CapabilityService } from '../resource/capability.service';

import { ResourceASNStoreService } from './resource-asn-store.service';
import {
  FAKE_STORED_ASN,
  FAKE_STORED_ASN_PREFIX_SYNC_METADATA,
  FAKE_STORED_ASN_RESOURCE_META,
  FAKE_STORED_PRIVATE_ASN,
} from './test-data';
import { PrefixSyncStoreService } from './prefix-sync-store.service';
import { PrefixSync } from './prefix-sync.entity';
import { normalizeAsn } from './utils';

describe('ResourceASNStoreService', () => {
  let service: ResourceASNStoreService;
  let resourceService: DeepMocked<ResourceService>;
  let capabilityService: DeepMocked<CapabilityService>;
  let syncService: DeepMocked<PrefixSyncStoreService>;
  let resourceTransactions: DeepMocked<ResourceTransactionService>;

  const fakeAsnResource = faker(Resource, {
    type: ResourceType.ASN,
    sourceId: String(FAKE_ASN),
    meta: FAKE_STORED_ASN_RESOURCE_META,
    deletedAt: null,
  });
  const fakeAsnCapability = faker(Capability, {
    type: CapabilityType.ASN,
  });
  const fakePrefixSync = faker(
    PrefixSync,
    FAKE_STORED_ASN_PREFIX_SYNC_METADATA,
  );
  const fakeStoredAsn = { ...FAKE_STORED_ASN, consoleIds: [] };
  const fakePrivateStoredAsn = { ...FAKE_STORED_PRIVATE_ASN, consoleIds: [] };
  const asns = [1234, 2345, 3456];
  const fakeStoredAsns = asns.map((asn) => ({ ...fakeStoredAsn, asn }));
  const fakeStoredPrivateAsns = asns.map((asn) => ({
    ...fakePrivateStoredAsn,
    asn,
  }));
  const fakeAsnResources = asns.map((asn) =>
    faker(Resource, {
      type: ResourceType.ASN,
      sourceId: String(asn),
      meta: FAKE_STORED_ASN_RESOURCE_META,
      deletedAt: null,
    }),
  );
  const fakePrefixSyncs = asns.map((asn) =>
    faker(PrefixSync, {
      ...FAKE_STORED_ASN_PREFIX_SYNC_METADATA,
      asn: normalizeAsn(asn),
    }),
  );

  beforeEach(() => {
    resourceService = createMock();
    capabilityService = createMock();
    syncService = createMock();
    resourceTransactions = createMock();
    service = new ResourceASNStoreService(
      resourceService,
      capabilityService,
      syncService,
      resourceTransactions,
    );
  });

  it('can fetch all resources for a given ASN and present them as a unified view of the ASN', async () => {
    expect.hasAssertions();

    resourceService.findByTypeAndSourceId.mockResolvedValue([fakeAsnResource]);
    syncService.findByAsn.mockResolvedValue(fakePrefixSync);

    expect(await service.getASN(FAKE_ASN)).toStrictEqual(fakeStoredAsn);

    expect(resourceService.findByTypeAndSourceId).toBeCalledWith(
      ResourceType.ASN,
      String(FAKE_ASN),
      { meta: JsonContains({ private: false }) },
      false,
    );

    expect(syncService.findByAsn).toBeCalledWith(FAKE_ASN);
  });

  it('can fetch all resources for a given list of ASNs and present them as a unified view of the ASNs', async () => {
    expect.hasAssertions();

    resourceService.findByTypeAndSourceId.mockResolvedValue(fakeAsnResources);
    syncService.findByAsns.mockResolvedValue(fakePrefixSyncs);

    expect(await service.getASNs(asns)).toStrictEqual(fakeStoredAsns);

    expect(resourceService.findByTypeAndSourceId).toBeCalledWith(
      ResourceType.ASN,
      In(asns.map(String)),
      { meta: JsonContains({ private: false }) },
      false,
    );

    expect(syncService.findByAsns).toBeCalledWith(asns);
  });

  it('can fetch all resources for a given private ASN and present them as a unified view of the ASN', async () => {
    expect.hasAssertions();

    resourceService.findByTypeAndSourceId.mockResolvedValue([fakeAsnResource]);

    expect(await service.getASN(FAKE_ASN, true)).toStrictEqual(
      fakePrivateStoredAsn,
    );

    expect(resourceService.findByTypeAndSourceId).toBeCalledWith(
      ResourceType.ASN,
      String(FAKE_ASN),
      { meta: JsonContains({ private: true }) },
      true,
    );
    expect(syncService.findByAsn).not.toBeCalled();
  });

  it('can fetch all resources for a given list of private ASNs and present them as a unified view of the ASNs', async () => {
    expect.hasAssertions();

    resourceService.findByTypeAndSourceId.mockResolvedValue(fakeAsnResources);

    expect(await service.getASNs(asns, true)).toStrictEqual(
      fakeStoredPrivateAsns,
    );

    expect(resourceService.findByTypeAndSourceId).toBeCalledWith(
      ResourceType.ASN,
      In(asns.map(String)),
      { meta: JsonContains({ private: true }) },
      true,
    );

    expect(syncService.findByAsns).not.toBeCalled();
  });

  it('can update prefix sync metadata for a given ASN', async () => {
    expect.hasAssertions();

    await service.updatePrefixSyncMetadata(fakeStoredAsn, {
      ipPrefixLastCheckedAt: FIRST_MAR_2020,
    });

    expect(syncService.update).toBeCalledWith(FAKE_ASN, {
      ipPrefixLastCheckedAt: FIRST_MAR_2020,
    });
  });

  it('can allocate a given private ASN to a given company', async () => {
    expect.hasAssertions();

    const asnToAllocate = { ...fakeStoredAsn, resourceIds: [] };

    capabilityService.createCapability.mockResolvedValue(fakeAsnCapability);
    resourceService.createResource.mockResolvedValue(fakeAsnResource);

    await service.allocatePrivateAsn(asnToAllocate, FAKE_OBJECT_ID);

    expect(asnToAllocate.resourceIds).toStrictEqual([FAKE_UUID]);

    expect(resourceService.createResource).toBeCalledWith({
      sourceId: String(FAKE_ASN),
      type: ResourceType.ASN,
      meta: { private: true, status: 'VERIFIED', companyId: FAKE_OBJECT_ID },
    });
    expect(capabilityService.createCapability).toBeCalledWith({
      type: CapabilityType.ASN,
      resource: fakeAsnResource,
    });
  });

  it('can reallocate a given private ASN to a given company', async () => {
    expect.hasAssertions();

    const asnToAllocate = { ...fakeStoredAsn };

    await service.allocatePrivateAsn(asnToAllocate, FAKE_OBJECT_ID);

    expect(resourceService.restoreResourceById).toBeCalledWith(FAKE_UUID);
    expect(resourceService.updateResourceById).toBeCalledWith(FAKE_UUID, {
      meta: { private: true, status: 'VERIFIED', companyId: FAKE_OBJECT_ID },
    });
  });

  it('can fetch an ASN resource by ID', async () => {
    expect.hasAssertions();
    resourceService.findOneByTypeAndId.mockResolvedValue(fakeAsnResource);
    syncService.findByAsn.mockResolvedValue(fakePrefixSync);

    expect(await service.getASNResourceById(FAKE_UUID)).toStrictEqual(
      fakeAsnResource,
    );

    expect(resourceService.findOneByTypeAndId).toBeCalledWith(
      ResourceType.ASN,
      FAKE_UUID,
    );
  });

  it('can deallocate an asn', async () => {
    expect.hasAssertions();

    const asnWithResourceId = { ...fakeStoredAsn, resourceIds: [FAKE_UUID] };

    resourceService.findOneByTypeAndId.mockResolvedValue(fakeAsnResource);

    await service.deallocateAsn(asnWithResourceId);

    expect(resourceTransactions.removeResourceTransaction).toBeCalledWith(
      fakeAsnResource,
    );
  });

  it('can allocate a given public ASN to a company', async () => {
    expect.hasAssertions();

    const asnToAllocate = {
      ...fakeStoredAsn,
      resourceIds: [],
    };

    capabilityService.createCapability.mockResolvedValue(fakeAsnCapability);
    resourceService.createResource.mockResolvedValue(fakeAsnResource);

    await service.allocatePublicAsn(asnToAllocate, FAKE_OBJECT_ID);

    expect(asnToAllocate.resourceIds).toStrictEqual([FAKE_UUID]);

    expect(resourceService.createResource).toBeCalledWith({
      sourceId: String(FAKE_ASN),
      type: ResourceType.ASN,
      meta: { private: false, status: 'VERIFIED', companyId: FAKE_OBJECT_ID },
    });
    expect(capabilityService.createCapability).toBeCalledWith({
      type: CapabilityType.ASN,
      resource: fakeAsnResource,
    });
  });

  it('can reallocate a given public ASN to a given company', async () => {
    expect.hasAssertions();

    const asnToAllocate = { ...fakeStoredAsn };

    await service.allocatePublicAsn(asnToAllocate, FAKE_OBJECT_ID);

    expect(resourceService.restoreResourceById).toBeCalledWith(FAKE_UUID);
    expect(resourceService.updateResourceById).toBeCalledWith(FAKE_UUID, {
      meta: { private: false, status: 'VERIFIED', companyId: FAKE_OBJECT_ID },
    });
  });
});
