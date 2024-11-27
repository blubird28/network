import { FindOneOptions, Repository } from 'typeorm';
import { isDate, isString, set } from 'lodash';

import {
  Injectable,
  InjectionToken,
  Logger,
  Provider,
  Type,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ReferenceService } from '@libs/nebula/ReferenceBuilder/reference.service';

import { CONVERTER_SERVICE_TOKEN_PREFIX, WRAPPER_TARGET } from './constants';
import { DataSyncDispatch } from './queue';

export interface DataSyncConverterService<
  Source extends object,
  Target extends object,
> {
  /**
   * Find an existing instance of Target to sync to, if any (or undefined)
   */
  getExistingTarget(source: Source): Promise<Target | undefined>;

  syncTarget(source: Source, dispatch: DataSyncDispatch): Promise<void>;
}

export interface DefaultDataSyncConverterService<
  Source extends object,
  Target extends object,
> extends DataSyncConverterService<Source, Target> {
  findOneOptions(source: Source): FindOneOptions<Target>;
  isSourceDeleted(source: Source): boolean;
  getSourceId(source: Source): string;
  getSourceDeletedAt(source: Source): Date;
  createTarget(source: Source, dispatch: DataSyncDispatch): Promise<void>;
  updateTarget(
    source: Source,
    target: Target,
    dispatch: DataSyncDispatch,
  ): Promise<void>;
  deleteTarget(
    source: Source,
    target: Target,
    dispatch: DataSyncDispatch,
  ): Promise<void>;
  saveTarget(target: Target): Promise<Target>;
  createTargetEntity(source: Source): Target;
  updateTargetEntity(
    source: Source,
    target: Target,
  ): Promise<Target | undefined>;
  deleteTargetEntity(
    source: Source,
    target: Target,
  ): Promise<Target | undefined>;
}

export const dataSyncConverterServiceToken = (source: Type, target: Type) =>
  Symbol.for(
    [CONVERTER_SERVICE_TOKEN_PREFIX, source.name, target.name].join('_'),
  );

export const getDefaultConverterService = <
  Source extends object,
  Target extends object,
>(
  source: Type<Source>,
  target: Type<Target>,
  connection?: string,
): Type<DefaultDataSyncConverterService<Source, Target>> => {
  @Injectable()
  class DefaultConverterService
    implements DefaultDataSyncConverterService<Source, Target>
  {
    private logger: Logger = new Logger(
      `Converter<${source.name}, ${target.name}>`,
    );
    constructor(
      @InjectRepository(target, connection)
      private readonly repository: Repository<Target>,
      private readonly referenceService: ReferenceService,
    ) {}

    getSourceId(source: Source): string {
      if (!source?.['id']) {
        this.logger.warn(
          'Received a source with no id (mongoId). This is unexpected and cannot be synced successfully',
        );
        throw new Error('Invalid Source: Missing id');
      }

      return source?.['id'];
    }

    findOneOptions(_ignoredSource: Source): FindOneOptions {
      throw new Error('Default findOneOptions not overridden');
    }

    async updateTargetEntity(source: Source, target: Target) {
      this.logger.warn('Default updateTargetEntity not overridden');
      return target;
    }

    async getExistingTarget(source: Source) {
      return await this.repository.findOne(this.findOneOptions(source));
    }

    isSourceDeleted(source: Source): boolean {
      return !!(source['deletedAt'] || source['deleted']);
    }

    getSourceDeletedAt(source: Source): Date {
      const deletedAt = source['deletedAt'];
      if (isDate(deletedAt)) {
        return deletedAt;
      }
      if (isString(deletedAt)) {
        const deletedAtDate = new Date(deletedAt);
        if (deletedAtDate.toJSON() === deletedAt) {
          return deletedAtDate;
        }
      }
      return new Date();
    }

    createTargetEntity(_ignoredSource: Source): Target {
      return this.repository.create();
    }

    async createTarget(
      source: Source,
      dispatch: DataSyncDispatch,
    ): Promise<void> {
      await this.updateTarget(
        source,
        this.createTargetEntity(source),
        dispatch,
      );
    }

    async saveTarget(target: Target): Promise<Target> {
      return this.repository.save(target);
    }

    async updateTarget(
      source: Source,
      target: Target,
      dispatch: DataSyncDispatch,
    ): Promise<void> {
      const updated = await this.updateTargetEntity(source, target);
      if (updated) {
        await this.saveTarget(updated);
        dispatch.result(updated);
      }
    }

    async deleteTargetEntity(
      source: Source,
      target: Target,
    ): Promise<Target | undefined> {
      set(target, 'deletedAt', this.getSourceDeletedAt(source));
      return target;
    }

    async deleteTarget(
      source: Source,
      target: Target,
      dispatch: DataSyncDispatch,
    ): Promise<void> {
      const deleted = await this.deleteTargetEntity(source, target);
      if (deleted) {
        await this.saveTarget(deleted);
        dispatch.result(target);
      }
    }

    async syncExistingTarget(
      source: Source,
      target: Target,
      dispatch: DataSyncDispatch,
    ) {
      const isSourceDeleted = this.isSourceDeleted(source);
      const ref = this.referenceService.reference(target, WRAPPER_TARGET);
      if (isSourceDeleted) {
        this.logger.debug(
          `Source is deleted, deleting existing target: ${ref}`,
        );
        await this.deleteTarget(source, target, dispatch);
      } else {
        this.logger.debug(`Found existing target: ${ref}`);
        await this.updateTarget(source, target, dispatch);
      }
    }

    async syncTarget(
      source: Source,
      dispatch: DataSyncDispatch,
    ): Promise<void> {
      const target = await this.getExistingTarget(source);
      if (target) {
        await this.syncExistingTarget(source, target, dispatch);
      } else if (this.isSourceDeleted(source)) {
        this.logger.debug(`Source is deleted, skipping create`);
      } else {
        this.logger.debug('No existing target found, creating a new one');
        await this.createTarget(source, dispatch);
      }
    }
  }

  return DefaultConverterService;
};

export const dataSyncConverterServiceProvider = <
  Source extends object,
  Target extends object,
>(
  source: Type<Source>,
  target: Type<Target>,
  useClass: Type<
    DataSyncConverterService<Source, Target>
  > = getDefaultConverterService(source, target),
  provide: InjectionToken = dataSyncConverterServiceToken(source, target),
): Provider => ({ provide, useClass });

export default getDefaultConverterService;
