import { Controller, Get, Param } from '@nestjs/common';

import { ResourceDto } from '@libs/nebula/dto/network/resource.dto';
import toDto from '@libs/nebula/utils/data/toDto';
import { ResourceIdDto } from '@libs/nebula/dto/network/resource-id.dto';

import { ResourceService } from './resource.service';

@Controller('/resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get('/{id}')
  async getResourceById(@Param() { id }: ResourceIdDto): Promise<ResourceDto> {
    const resource = await this.resourceService.getResourceById(id);

    return toDto(resource, ResourceDto);
  }
}
