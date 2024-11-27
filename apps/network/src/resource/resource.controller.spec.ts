import { lstatSync } from 'fs';

import { createMock, DeepMocked } from '@golevelup/ts-jest';

import { faker } from '@libs/nebula/testing/data/fakers';
import { ResourceIdDto } from '@libs/nebula/dto/network/resource-id.dto';
import { ResourceDto } from '@libs/nebula/dto/network/resource.dto';
import { FAKE_UUID, FIRST_JAN_2020 } from '@libs/nebula/testing/data/constants';

import { Resource } from './resource.entity';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';

describe('Resource Controller', () => {
  let controller: ResourceController;
  let resource: DeepMocked<ResourceService>;
  beforeEach(() => {
    resource = createMock();
    controller = new ResourceController(resource);
  });
  it('gets Resource given a resource ID', async () => {
    expect.hasAssertions();

    const mockResourceDto: ResourceDto = faker(ResourceDto);

    mockResourceDto.meta = {
      lastSynced: FIRST_JAN_2020,
    };

    mockResourceDto.capabilities = [];
    mockResourceDto.usages = [];

    const mockResource = faker(Resource, {
      id: FAKE_UUID,
      sourceId: FAKE_UUID,
    });

    const mockResourceWithIdDto: ResourceIdDto = {
      id: FAKE_UUID,
    };

    resource.getResourceById.mockResolvedValue(mockResource);

    const result = await controller.getResourceById(mockResourceWithIdDto);
    expect(resource.getResourceById).toBeCalledWith(FAKE_UUID);
    expect(result).toStrictEqual(mockResourceDto);
  });
});
