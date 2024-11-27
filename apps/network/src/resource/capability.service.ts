import { DeepPartial, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CapabilityType } from '@libs/nebula/Network/constants';

import { TYPEORM_CONNECTION_NAME } from '../constants';

import { Capability } from './capability.entity';

@Injectable()
export class CapabilityService {
  constructor(
    @InjectRepository(Capability, TYPEORM_CONNECTION_NAME)
    private readonly capabilityRepository: Repository<Capability>,
  ) {}

  public async getCapabilityByResourceAndType(
    resourceId: string,
    type: CapabilityType,
  ): Promise<Capability> {
    return this.capabilityRepository.findOneOrFail({
      where: {
        resource: { id: resourceId },
        type,
      },
    });
  }

  public async createCapability(
    entity: DeepPartial<Capability>,
  ): Promise<Capability> {
    return this.capabilityRepository.save(
      this.capabilityRepository.create(entity),
    );
  }
}
