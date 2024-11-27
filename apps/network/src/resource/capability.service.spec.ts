import { Repository } from 'typeorm';
import { DeepMocked } from '@golevelup/ts-jest';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CapabilityType } from '@libs/nebula/Network/constants';
import { faker } from '@libs/nebula/testing/data/fakers';
import { FAKE_UUID } from '@libs/nebula/testing/data/constants';
import { Mocker } from '@libs/nebula/testing/mocker/mocker';

import { TYPEORM_CONNECTION_NAME } from '../constants';
import { Resource } from '../resource/resource.entity';
import { Usage } from '../resource/usage.entity';

import { Capability } from './capability.entity';
import { CapabilityService } from './capability.service';

describe('CapabilityService', () => {
  let service: CapabilityService;
  let repository: DeepMocked<Repository<Capability>>;

  const mockResource = faker(Resource, {
    id: 'resource-id',
  });

  const mockCapability: Capability = faker(Capability, {
    id: FAKE_UUID,
    type: CapabilityType.IP_ADDRESSES,
    limit: 100,
    meta: {},
    resource: mockResource,
    usages: [faker(Usage)],
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CapabilityService],
    })
      .useMocker(
        Mocker.services(
          getRepositoryToken(Capability, TYPEORM_CONNECTION_NAME),
        ),
      )
      .compile();

    service = module.get<CapabilityService>(CapabilityService);
    repository = module.get(
      getRepositoryToken(Capability, TYPEORM_CONNECTION_NAME),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCapabilityByResourceAndType', () => {
    it('should return a capability when found', async () => {
      repository.findOneOrFail.mockResolvedValueOnce(mockCapability);

      const result = await service.getCapabilityByResourceAndType(
        'resource-id',
        CapabilityType.IP_ADDRESSES,
      );

      expect(result).toEqual(mockCapability);
      expect(repository.findOneOrFail).toHaveBeenCalledWith({
        where: {
          resource: { id: 'resource-id' },
          type: CapabilityType.IP_ADDRESSES,
        },
      });
    });

    it('should throw an error when capability is not found', async () => {
      repository.findOneOrFail.mockRejectedValueOnce(new Error('Not Found'));

      await expect(
        service.getCapabilityByResourceAndType(
          'invalid-resource-id',
          CapabilityType.IP_ADDRESSES,
        ),
      ).rejects.toThrow('Not Found');

      expect(repository.findOneOrFail).toHaveBeenCalledWith({
        where: {
          resource: { id: 'invalid-resource-id' },
          type: CapabilityType.IP_ADDRESSES,
        },
      });
    });
  });

  describe('createCapability', () => {
    it('should create a capability', async () => {
      repository.create.mockReturnValue(mockCapability);
      repository.save.mockResolvedValueOnce(mockCapability);

      const result = await service.createCapability({
        type: CapabilityType.ASN,
      });

      expect(result).toEqual(mockCapability);
      expect(repository.create).toHaveBeenCalledWith({
        type: CapabilityType.ASN,
      });
      expect(repository.save).toHaveBeenCalledWith(mockCapability);
    });
  });
});
