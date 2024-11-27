import { DataSource, QueryRunner } from 'typeorm';

import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { SerializedObject } from '@libs/nebula/Serialization/serializes';
import zeroOrMore, { ZeroOrMore } from '@libs/nebula/utils/data/zeroOrMore';
import Errors from '@libs/nebula/Error';
import getErrorMessage from '@libs/nebula/utils/data/getErrorMessage';
import {
  CapabilityType,
  ResourceType,
  UsageType,
} from '@libs/nebula/Network/constants';

import { TYPEORM_CONNECTION_NAME } from '../constants';

import { Resource } from './resource.entity';
import { Capability } from './capability.entity';
import { Usage } from './usage.entity';

interface ResourceRequest {
  type: ResourceType;
  sourceId: string;
  meta?: SerializedObject;
}
interface ResourceRelations {
  capabilities?: ZeroOrMore<CapabilityRequest>;
  usages?: ZeroOrMore<UsageRequest>;
}
interface CapabilityRequest {
  type: CapabilityType;
  limit: number | null;
  meta?: SerializedObject;
}
interface UsageRequest {
  capabilityId: string;
  type: UsageType;
  amount: number | null;
  meta?: SerializedObject;
}

// Handling transactions well means not using the DI'd repositories here - all operations have to be via the queryRunner
// the transaction started on. If we have simpler, non-transactional stuff to do with resources later we ought to make a
// ResourceService using the repositories separate from the transactional stuff here.
@Injectable()
export class ResourceTransactionService {
  private readonly logger = new Logger(ResourceTransactionService.name);
  constructor(
    @InjectDataSource(TYPEORM_CONNECTION_NAME)
    private readonly dataSource: DataSource,
  ) {}

  async createResourceTransaction({
    usages,
    capabilities,
    ...request
  }: ResourceRequest & ResourceRelations): Promise<Resource> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const resource = await this.createResourceWithQueryRunner(
        request,
        queryRunner,
      );
      resource.usages = await Promise.all(
        zeroOrMore(usages).map((usage) =>
          this.createUsageForResourceWithQueryRunner(
            usage,
            resource,
            queryRunner,
          ),
        ),
      );
      resource.capabilities = await Promise.all(
        zeroOrMore(capabilities).map((capability) =>
          this.createCapabilityForResourceWithQueryRunner(
            capability,
            resource,
            queryRunner,
          ),
        ),
      );

      await queryRunner.commitTransaction();

      return resource;
    } catch (err) {
      this.logger.error(
        `Error while creating resource: ${getErrorMessage(err)}`,
      );
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async removeResourceTransaction(resource: Resource): Promise<void> {
    if (resource.isBeingUsed()) {
      throw new Errors.ResourceIsBeingUsed({ id: resource.id });
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.softRemove(Usage, resource.usages);
      await queryRunner.manager.softRemove(Capability, resource.capabilities);
      await queryRunner.manager.softRemove(Resource, resource);

      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(
        `Error while removing resource: ${getErrorMessage(err)}`,
      );
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  private createResourceWithQueryRunner(
    { type, sourceId, meta = {} }: ResourceRequest,
    queryRunner: QueryRunner,
  ): Promise<Resource> {
    return queryRunner.manager.save(
      Resource,
      queryRunner.manager.create(Resource, { type, sourceId, meta }),
    );
  }

  private async createUsageForResourceWithQueryRunner(
    { capabilityId, amount, type, meta = {} }: UsageRequest,
    resource: Resource,
    queryRunner: QueryRunner,
  ): Promise<Usage> {
    const capability = await queryRunner.manager.findOneByOrFail(Capability, {
      id: capabilityId,
    });
    const usage = await queryRunner.manager.save(
      Usage,
      queryRunner.manager.create(Usage, {
        amount,
        type,
        meta,
        capability,
        resource,
      }),
    );
    await this.validateUsageAddedWithQueryRunner(usage, queryRunner);
    return usage;
  }

  private createCapabilityForResourceWithQueryRunner(
    { limit, type, meta = {} }: CapabilityRequest,
    resource: Resource,
    queryRunner: QueryRunner,
  ): Promise<Capability> {
    return queryRunner.manager.save(
      Capability,
      queryRunner.manager.create(Capability, { limit, type, meta, resource }),
    );
  }

  private async validateUsageAddedWithQueryRunner(
    { capability, type: usageType, amount: usageAmount }: Usage,
    queryRunner: QueryRunner,
  ) {
    const limit = capability.limit ?? 0;
    if (limit > 0) {
      const used =
        (await queryRunner.manager.sum(Usage, 'amount', {
          capability: { id: capability.id },
        })) ?? 0;
      if (used > limit) {
        throw new Errors.UsageOverCapabilityLimit({
          capabilityType: capability.type,
          capabilityId: capability.id,
          resourceType: capability.resource.type,
          resourceId: capability.resource.id,
          usageType,
          usageAmount,
          used,
          limit,
        });
      }
    }
  }
}
