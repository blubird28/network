import { DeepMocked, createMock } from '@golevelup/ts-jest';

import { faker } from '@libs/nebula/testing/data/fakers';
import { UpdateIpBlockMetaRequestDto } from '@libs/nebula/dto/network/update-ip-block-meta-request.dto';
import { ResourceType } from '@libs/nebula/Network/constants';

import { Resource } from '../resource/resource.entity';

import { IpBlockController } from './ip-block.controller';
import { IpBlockService } from './ip-block.service';

describe('IpBlockController', () => {
  let controller: IpBlockController;
  let service: DeepMocked<IpBlockService>;

  const publicResource = faker(Resource, {
    type: ResourceType.IP_BLOCK,
  });
  const updateMetaRequestDto = faker(UpdateIpBlockMetaRequestDto);

  beforeEach(async () => {
    service = createMock<IpBlockService>();
    controller = new IpBlockController(service);
  });

  it('updates meta on an ip block ', async () => {
    service.updateIpBlockMetaData.mockResolvedValue();

    const result = await controller.updateIpBlockMetaData(
      publicResource,
      updateMetaRequestDto,
    );

    expect(result).toBeUndefined();
    expect(service.updateIpBlockMetaData).toBeCalledWith(
      publicResource.id,
      updateMetaRequestDto,
    );
  });
});
