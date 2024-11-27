import { IsNull, Not, Repository } from 'typeorm';
import { DeepMocked } from '@golevelup/ts-jest';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Res } from '@nestjs/common';

import {
  CapabilityType,
  ResourceType,
  UsageType,
} from '@libs/nebula/Network/constants';
import { faker } from '@libs/nebula/testing/data/fakers';
import { Mocker } from '@libs/nebula/testing/mocker/mocker';
import { FAKE_ASN, FAKE_UUID } from '@libs/nebula/testing/data/constants';

import { TYPEORM_CONNECTION_NAME } from '../constants';

import { Resource } from './resource.entity';
import { ResourceService } from './resource.service';

describe('ResourceService', () => {
  let service: ResourceService;
  let repository: DeepMocked<Repository<Resource>>;
  const repoToken = getRepositoryToken(Resource, TYPEORM_CONNECTION_NAME);
  const addedFilter = { meta: Not(IsNull()) };

  const mockResource = faker(Resource, {
    id: 'resource-id',
    sourceId: 'source-id',
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResourceService],
    })
      .useMocker(Mocker.services(repoToken))
      .compile();

    service = module.get(ResourceService);
    repository = module.get(repoToken);
  });

  describe('findByTypeAndSourceId', () => {
    it('should return resources when found', async () => {
      repository.find.mockResolvedValueOnce([mockResource]);

      const result = await service.findByTypeAndSourceId(
        ResourceType.ASN,
        'source-id',
      );

      expect(result).toStrictEqual([mockResource]);
      expect(repository.find).toHaveBeenCalledWith({
        where: {
          sourceId: 'source-id',
          type: CapabilityType.ASN,
        },
        withDeleted: false,
      });
    });

    it('handles an optional where and includeDeleted param', async () => {
      repository.find.mockResolvedValueOnce([mockResource]);

      const result = await service.findByTypeAndSourceId(
        ResourceType.ASN,
        'source-id',
        addedFilter,
        true,
      );

      expect(result).toStrictEqual([mockResource]);
      expect(repository.find).toHaveBeenCalledWith({
        where: {
          sourceId: 'source-id',
          type: CapabilityType.ASN,
          ...addedFilter,
        },
        withDeleted: true,
      });
    });
  });

  describe('findOneByTypeAndId', () => {
    it('should return a resource when found', async () => {
      repository.findOneOrFail.mockResolvedValueOnce(mockResource);

      const result = await service.findOneByTypeAndId(
        ResourceType.ASN,
        'resource-id',
      );

      expect(result).toStrictEqual(mockResource);
      expect(repository.findOneOrFail).toHaveBeenCalledWith({
        where: {
          id: 'resource-id',
          type: CapabilityType.ASN,
        },
        withDeleted: false,
        relations: {
          capabilities: {
            usages: true,
          },
          usages: true,
        },
      });
    });

    it('handles an optional where and includeDeleted param', async () => {
      repository.findOneOrFail.mockResolvedValueOnce(mockResource);

      const result = await service.findOneByTypeAndId(
        ResourceType.ASN,
        'resource-id',
        addedFilter,
        true,
      );

      expect(result).toStrictEqual(mockResource);
      expect(repository.findOneOrFail).toHaveBeenCalledWith({
        where: {
          id: 'resource-id',
          type: CapabilityType.ASN,
          ...addedFilter,
        },
        withDeleted: true,
        relations: {
          capabilities: {
            usages: true,
          },
          usages: true,
        },
      });
    });
  });

  it('can update a resource by ID', async () => {
    expect.hasAssertions();
    const updates = { meta: { updated: true } };

    await service.updateResourceById(FAKE_UUID, updates);

    expect(repository.update).toBeCalledWith({ id: FAKE_UUID }, updates);
  });

  it('can restore a resource by ID', async () => {
    expect.hasAssertions();

    await service.restoreResourceById(FAKE_UUID);

    expect(repository.restore).toBeCalledWith({ id: FAKE_UUID });
  });

  it('can get a resource by ID', async () => {
    expect.hasAssertions();

    const expectedQuery = {
      relations: {
        capabilities: {
          usages: true,
        },
        usages: true,
      },
      where: {
        id: FAKE_UUID,
      },
    };

    await service.getResourceById(FAKE_UUID);

    expect(repository.findOneOrFail).toBeCalledWith(expectedQuery);
  });

  it('can create a resource', async () => {
    expect.hasAssertions();
    const resource = {
      sourceId: String(FAKE_ASN),
      type: ResourceType.ASN,
      meta: { foo: true },
    };

    await service.createResource(resource);

    expect(repository.create).toBeCalledWith(resource);
  });

  it('can fetch a resource which has active usages of a given UsageType', async () => {
    expect.hasAssertions();

    repository.find.mockResolvedValueOnce([mockResource]);
    const expectedQuery = {
      where: {
        capabilities: {
          usages: {
            type: UsageType.ASN,
          },
        },
      },
    };

    expect(await service.findByActiveUsage(UsageType.ASN)).toStrictEqual([
      mockResource,
    ]);

    expect(repository.find).toBeCalledWith(expectedQuery);
  });

  it('can fetch a resource which has active usages of a given UsageType with an optional query', async () => {
    expect.hasAssertions();

    repository.find.mockResolvedValueOnce([mockResource]);
    const expectedQuery = {
      where: {
        type: ResourceType.ASN,
        capabilities: {
          usages: {
            type: UsageType.ASN,
          },
        },
      },
    };

    expect(
      await service.findByActiveUsage(UsageType.ASN, {
        type: ResourceType.ASN,
      }),
    ).toStrictEqual([mockResource]);

    expect(repository.find).toBeCalledWith(expectedQuery);
  });
});
