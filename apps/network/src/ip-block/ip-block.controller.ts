import HttpStatusCodes from 'http-status-codes';

import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { AssignIpBlockRequestDto } from '@libs/nebula/dto/network/assign-ip-block-request.dto';
import { AssignIpBlockResponseDto } from '@libs/nebula/dto/network/assign-ip-block-response.dto';
import { AssignLinknetIpBlockResponseDto } from '@libs/nebula/dto/network/assign-linknet-ip-block-response.dto';
import toDto from '@libs/nebula/utils/data/toDto';
import { ResourceIdDto } from '@libs/nebula/dto/network/resource-id.dto';
import { UpdateIpBlockMetaRequestDto } from '@libs/nebula/dto/network/update-ip-block-meta-request.dto';

import { IpBlockService } from './ip-block.service';

@Controller('/ip-block')
export class IpBlockController {
  constructor(private readonly ipBlock: IpBlockService) {}
  @Post('/public')
  async assignPublicIpBlock(
    @Body() body: AssignIpBlockRequestDto,
  ): Promise<AssignIpBlockResponseDto> {
    const resource = await this.ipBlock.assignPublicIp(body);
    return toDto(
      { resourceId: resource.id, cidr: resource.meta?.cidr },
      AssignIpBlockResponseDto,
    );
  }

  @Post('/linknet')
  async assignLinknetIpBlock(
    @Body() body: AssignIpBlockRequestDto,
  ): Promise<AssignLinknetIpBlockResponseDto> {
    const resource = await this.ipBlock.assignLinknetIp(body);
    return toDto(
      {
        resourceId: resource.id,
        cidr: resource.meta?.cidr,
        consoleRouterIp: resource.meta?.consoleRouterIp,
        customerRouterIp: resource.meta?.customerRouterIp,
      },
      AssignLinknetIpBlockResponseDto,
    );
  }

  @HttpCode(HttpStatusCodes.NO_CONTENT)
  @Patch('/:id')
  async updateIpBlockMetaData(
    @Param() { id }: ResourceIdDto,
    @Body() body: UpdateIpBlockMetaRequestDto,
  ): Promise<void> {
    await this.ipBlock.updateIpBlockMetaData(id, body);
  }

  @HttpCode(HttpStatusCodes.OK)
  @Delete('/:id')
  async unassignIpBlock(@Param() { id }: ResourceIdDto): Promise<void> {
    await this.ipBlock.unassignIpBlock(id);
  }
}
