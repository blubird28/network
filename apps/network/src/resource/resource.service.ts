import {
  DeepPartial,
  FindOptionsWhere,
  FindOptionsWhereProperty,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ResourceType, UsageType } from '@libs/nebula/Network/constants';
import Errors from '@libs/nebula/Error';

import { TYPEORM_CONNECTION_NAME } from '../constants';

import { Resource } from './resource.entity';

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource, TYPEORM_CONNECTION_NAME)
    private readonly resources: Repository<Resource>,
  ) {}

  findByTypeAndSourceId(
    type: FindOptionsWhereProperty<NonNullable<ResourceType>>,
    sourceId: FindOptionsWhereProperty<NonNullable<string>>,
    where: FindOptionsWhere<Resource> = {},
    withDeleted = false,
  ): Promise<Resource[]> {
    return this.resources.find({
      where: { type, sourceId, ...where },
      withDeleted,
    });
  }

  findByActiveUsage(
    usageType: FindOptionsWhereProperty<NonNullable<UsageType>>,
    where: FindOptionsWhere<Resource> = {},
  ): Promise<Resource[]> {
    return this.resources.find({
      where: {
        capabilities: {
          usages: {
            type: usageType,
          },
        },
        ...where,
      },
    });
  }

  findOneByTypeAndId(
    type: FindOptionsWhereProperty<NonNullable<ResourceType>>,
    id: FindOptionsWhereProperty<NonNullable<string>>,
    where: FindOptionsWhere<Resource> = {},
    withDeleted = false,
  ) {
    return this.resources.findOneOrFail({
      where: { type, id, ...where },
      withDeleted,
      relations: {
        capabilities: {
          usages: true,
        },
        usages: true,
      },
    });
  }

  public async updateResourceById(
    id: string,
    updates: QueryDeepPartialEntity<Resource>,
  ): Promise<void> {
    await this.resources.update({ id }, updates);
  }

  public createResource(entity: DeepPartial<Resource>): Promise<Resource> {
    return this.resources.save(this.resources.create(entity));
  }

  public async restoreResourceById(
    id: FindOptionsWhereProperty<NonNullable<string>>,
  ): Promise<void> {
    await this.resources.restore({ id });
  }

  public async getResourceById(
    id: FindOptionsWhereProperty<NonNullable<string>>,
  ): Promise<Resource> {
    try {
      return await this.resources.findOneOrFail({
        where: { id },
        relations: {
          capabilities: {
            usages: true,
          },
          usages: true,
        },
      });
    } catch {
      throw new Errors.NotFound();
    }
  }
}
