import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

import { CreateIoDResourceRequestDto } from '@libs/nebula/dto/network/create-iod-resource-request.dto';
import { ResourceDto } from '@libs/nebula/dto/network/resource.dto';
import { ResourceIdDto } from '@libs/nebula/dto/network/resource-id.dto';
import toDto from '@libs/nebula/utils/data/toDto';

import { IoDService } from './iod.service';

@Controller('/iod')
export class IoDController {
  constructor(private readonly iodService: IoDService) {}

  @Post('/')
  async createIoDResource(
    @Body() body: CreateIoDResourceRequestDto,
  ): Promise<ResourceDto> {
    const resource = await this.iodService.createIoDResource(body);

    return toDto(resource, ResourceDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteIoDResource(@Param() { id }: ResourceIdDto): Promise<void> {
    await this.iodService.deleteIoDService(id);
  }
}
