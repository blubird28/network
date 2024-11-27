import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { createMock, DeepMocked } from '@golevelup/ts-jest';

import { Type } from '@nestjs/common';

import {
  CapabilityType,
  ResourceType,
  UsageType,
} from '@libs/nebula/Network/constants';
import { faker } from '@libs/nebula/testing/data/fakers';
import { FAKE_UUID, FIRST_JAN_2020 } from '@libs/nebula/testing/data/constants';
import Errors from '@libs/nebula/Error';

import { ResourceTransactionService } from './resource-transaction.service';
import { Resource } from './resource.entity';
import { Usage } from './usage.entity';
import { Capability } from './capability.entity';

describe('ResourceTransactionService', () => {
  let service: ResourceTransactionService;
  let queryRunner: DeepMocked<QueryRunner>;
  let manager: DeepMocked<EntityManager>;
  const meta = { lastSynced: FIRST_JAN_2020 };
  const baseResourceRequest = {
    type: ResourceType.IOD_SITE,
    sourceId: FAKE_UUID,
    meta,
  };
  const baseUsageRequest = {
    type: UsageType.PUBLIC_IP,
    amount: 100,
    capabilityId: FAKE_UUID,
    meta,
  };
  const baseCapabilityRequest = {
    type: CapabilityType.IP_ADDRESSES,
    limit: 1000,
    meta,
  };
  beforeEach(async () => {
    manager = createMock<EntityManager>({
      create: faker,
      save: async <T>(ignoredClass: Type<T>, entity: T): Promise<T> => entity,
      findOneByOrFail: async <T>(cls: Type<T>): Promise<T> => faker(cls),
      sum: async () => 500,
    });
    queryRunner = createMock<QueryRunner>({ manager });
    service = new ResourceTransactionService(
      createMock<DataSource>({
        createQueryRunner: jest.fn().mockReturnValue(queryRunner),
      }),
    );
  });

  it('Creates a resource', async () => {
    expect.hasAssertions();

    const result = await service.createResourceTransaction({
      ...baseResourceRequest,
    });

    expect(result).toStrictEqual(faker(Resource));
    expect(queryRunner.startTransaction).toHaveBeenCalledTimes(1);
    expect(queryRunner.commitTransaction).toHaveBeenCalledTimes(1);
    expect(queryRunner.release).toHaveBeenCalledTimes(1);
    expect(manager.create).toHaveBeenCalledWith(Resource, baseResourceRequest);
    expect(manager.save).toHaveBeenCalledWith(Resource, faker(Resource));
    expect(queryRunner.rollbackTransaction).not.toHaveBeenCalled();
  });

  it('Removes a resource', async () => {
    expect.hasAssertions();
    const mockResource = faker(Resource);
    await service.removeResourceTransaction(mockResource);

    expect(queryRunner.startTransaction).toHaveBeenCalledTimes(1);
    expect(queryRunner.commitTransaction).toHaveBeenCalledTimes(1);
    expect(queryRunner.release).toHaveBeenCalledTimes(1);
    expect(manager.softRemove).toHaveBeenCalledWith(Resource, mockResource);
    expect(queryRunner.rollbackTransaction).not.toHaveBeenCalled();
  });

  it('Fails to Remove a resource that isBeingUsed', async () => {
    expect.hasAssertions();
    const mockResourceWithUsage = faker(Resource, {
      capabilities: [faker(Capability, { usages: [faker(Usage)] })],
    });
    await expect(
      service.removeResourceTransaction(mockResourceWithUsage),
    ).rejects.toThrow(Errors.ResourceIsBeingUsed);
    expect(queryRunner.startTransaction).toHaveBeenCalledTimes(0);
  });

  it('Creates a resource along with usages and capabilities', async () => {
    expect.hasAssertions();

    const result = await service.createResourceTransaction({
      ...baseResourceRequest,
      usages: { ...baseUsageRequest },
      capabilities: { ...baseCapabilityRequest },
    });

    const expectedResource = faker(Resource);
    expectedResource.usages = [faker(Usage)];
    expectedResource.capabilities = [
      faker(Capability, { resource: expectedResource }),
    ];

    expect(result).toStrictEqual(expectedResource);
    expect(queryRunner.startTransaction).toHaveBeenCalledTimes(1);
    expect(queryRunner.commitTransaction).toHaveBeenCalledTimes(1);
    expect(queryRunner.release).toHaveBeenCalledTimes(1);
    expect(manager.create).toHaveBeenCalledWith(Resource, baseResourceRequest);
    expect(manager.save).toHaveBeenCalledWith(Resource, expectedResource);
    expect(manager.findOneByOrFail).toHaveBeenCalledWith(Capability, {
      id: FAKE_UUID,
    });
    expect(manager.create).toHaveBeenCalledWith(Usage, {
      type: UsageType.PUBLIC_IP,
      amount: 100,
      capability: faker(Capability),
      resource: expectedResource,
      meta,
    });
    expect(manager.save).toHaveBeenCalledWith(Usage, faker(Usage));
    expect(manager.sum).toHaveBeenCalledWith(Usage, 'amount', {
      capability: { id: FAKE_UUID },
    });
    expect(manager.create).toHaveBeenCalledWith(Capability, {
      ...baseCapabilityRequest,
      resource: expectedResource,
    });
    expect(manager.save).toHaveBeenCalledWith(
      Capability,
      faker(Capability, {
        resource: {
          ...expectedResource,
          capabilities: [],
          isBeingUsed: () => false,
        },
      }),
    );
    expect(queryRunner.rollbackTransaction).not.toHaveBeenCalled();
  });

  it('Creates a resource along with a usage against an unlimited capability', async () => {
    expect.hasAssertions();
    const unlimitedCapability = faker(Capability, { limit: 0 });

    manager.findOneByOrFail.mockImplementation(async (cls: Type) =>
      cls === Capability ? unlimitedCapability : faker(cls),
    );

    const result = await service.createResourceTransaction({
      ...baseResourceRequest,
      usages: { ...baseUsageRequest },
    });

    const expectedResource = faker(Resource);
    expectedResource.usages = [
      faker(Usage, { capability: unlimitedCapability }),
    ];

    expect(result).toStrictEqual(expectedResource);
    expect(queryRunner.startTransaction).toHaveBeenCalledTimes(1);
    expect(queryRunner.commitTransaction).toHaveBeenCalledTimes(1);
    expect(queryRunner.release).toHaveBeenCalledTimes(1);
    expect(manager.create).toHaveBeenCalledWith(Resource, baseResourceRequest);
    expect(manager.save).toHaveBeenCalledWith(Resource, expectedResource);
    expect(manager.findOneByOrFail).toHaveBeenCalledWith(Capability, {
      id: FAKE_UUID,
    });
    expect(manager.create).toHaveBeenCalledWith(Usage, {
      type: UsageType.PUBLIC_IP,
      amount: 100,
      capability: unlimitedCapability,
      resource: expectedResource,
      meta,
    });
    expect(manager.save).toHaveBeenCalledWith(
      Usage,
      faker(Usage, { capability: unlimitedCapability }),
    );
    expect(manager.sum).not.toHaveBeenCalled();
    expect(queryRunner.rollbackTransaction).not.toHaveBeenCalled();
  });
  it('Fails to create a resource if a used capability is not found', async () => {
    expect.hasAssertions();

    manager.findOneByOrFail.mockRejectedValue(new Error('Not Found'));

    await expect(
      service.createResourceTransaction({
        ...baseResourceRequest,
        usages: { ...baseUsageRequest },
      }),
    ).rejects.toThrow('Not Found');

    expect(queryRunner.startTransaction).toHaveBeenCalledTimes(1);
    expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
    expect(queryRunner.release).toHaveBeenCalledTimes(1);
    expect(manager.create).toHaveBeenCalledWith(Resource, baseResourceRequest);
    expect(manager.save).toHaveBeenCalledWith(Resource, faker(Resource));
    expect(manager.findOneByOrFail).toHaveBeenCalledWith(Capability, {
      id: FAKE_UUID,
    });
    expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
  });
  it('Fails to create a resource if a used capability would exceed its limit', async () => {
    expect.hasAssertions();

    manager.sum.mockResolvedValue(1500);

    await expect(
      service.createResourceTransaction({
        ...baseResourceRequest,
        usages: { ...baseUsageRequest },
      }),
    ).rejects.toThrow(Errors.UsageOverCapabilityLimit);

    expect(queryRunner.startTransaction).toHaveBeenCalledTimes(1);
    expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
    expect(queryRunner.release).toHaveBeenCalledTimes(1);
    expect(manager.create).toHaveBeenCalledWith(Resource, baseResourceRequest);
    expect(manager.save).toHaveBeenCalledWith(Resource, faker(Resource));
    expect(manager.findOneByOrFail).toHaveBeenCalledWith(Capability, {
      id: FAKE_UUID,
    });
    expect(manager.create).toHaveBeenCalledWith(Usage, {
      type: UsageType.PUBLIC_IP,
      amount: 100,
      capability: faker(Capability),
      resource: expect.any(Resource),
      meta,
    });
    expect(manager.save).toHaveBeenCalledWith(Usage, faker(Usage));
    expect(manager.sum).toHaveBeenCalledWith(Usage, 'amount', {
      capability: { id: FAKE_UUID },
    });
    expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
  });
});
