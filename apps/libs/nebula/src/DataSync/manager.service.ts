import { DiscoveryService } from '@golevelup/nestjs-discovery';
import { from, Observable } from 'rxjs';

import { Injectable, Logger, Provider, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import Errors, { BaseException } from '../Error';
import zeroOrMore, { ZeroOrMore } from '../utils/data/zeroOrMore';
import { ReferenceService } from '../ReferenceBuilder/reference.service';
import getErrorMessage from '../utils/data/getErrorMessage';
import { MapCache, CacheCreator } from '../MapCache/map-cache';
import { TypePair } from '../TypePair/type-pair';

import { DataSyncManagerQueue, DataSyncDispatch } from './queue';
import { DataSyncServiceMeta } from './decorators';
import {
  dataSyncFetcherProvider,
  DataSyncFetcherService,
} from './fetcher.service';
import {
  DATA_SYNC_CONVERTER_METADATA_KEY,
  DATA_SYNC_FETCHER_METADATA_KEY,
  WRAPPER_QUERY,
  WRAPPER_SOURCE,
} from './constants';
import {
  DataSyncConverterService,
  dataSyncConverterServiceProvider,
} from './converter.service';
import {
  DataSyncManagerFetchTask,
  DataSyncManagerSyncTask,
  DataSyncManagerTask,
} from './manager-task';
import { DataSyncManagerResults } from './manager-results';

// TODO: Should we ever delete a synced target? In which circumstances?

@Injectable()
export class DataSyncManager {
  private logger: Logger = new Logger(DataSyncManager.name);
  private converters: MapCache<TypePair, DataSyncConverterService<any, any>>;
  private fetchers: MapCache<TypePair, DataSyncFetcherService>;

  constructor(
    private referenceService: ReferenceService,
    private readonly discover: DiscoveryService,
    private readonly moduleRef: ModuleRef,
  ) {
    this.converters = new MapCache(
      this.getServiceByTypePairAndMeta(
        DATA_SYNC_CONVERTER_METADATA_KEY,
        Errors.DataSyncConverterNotFound,
      ),
    );
    this.fetchers = new MapCache(
      this.getServiceByTypePairAndMeta(
        DATA_SYNC_FETCHER_METADATA_KEY,
        Errors.DataSyncFetcherNotFound,
      ),
    );
  }

  private sourceRef(source: unknown) {
    return this.referenceService.reference(source, WRAPPER_SOURCE);
  }

  private queryRef(query: unknown) {
    return this.referenceService.reference(query, WRAPPER_QUERY);
  }

  private getServiceByTypePairAndMeta<C>(
    metadataKey: symbol,
    ErrorType: Type<BaseException>,
  ): CacheCreator<TypePair, C> {
    return async <S extends object, T extends object>(pair: TypePair<S, T>) => {
      const [source, target] = pair.types;
      const providers = await this.discover.providersWithMetaAtKey<
        DataSyncServiceMeta<S, T>
      >(metadataKey);

      const provider = providers.find(
        ({ meta }) => source === meta.source && target === meta.target,
      );

      if (!provider) {
        throw new ErrorType();
      }
      try {
        return await this.moduleRef.get(provider.meta.token);
      } catch (err) {
        throw new ErrorType();
      }
    };
  }

  private async getConverter<S extends object, T extends object>(
    source: Type<S>,
    target: Type<T>,
  ): Promise<DataSyncConverterService<S, T>> {
    return await this.converters.get(TypePair.get(source, target));
  }

  private async getFetcher<S extends object, T extends object>(
    source: Type<S>,
    target: Type<T>,
  ): Promise<DataSyncFetcherService> {
    return await this.fetchers.get(TypePair.get(source, target));
  }

  private async syncOne(
    { sourceType, targetType, source }: DataSyncManagerSyncTask,
    dispatch: DataSyncDispatch,
  ): Promise<void> {
    const ref = this.sourceRef(source);
    this.logger.debug(`Syncing from source: ${ref} ...`);

    try {
      const converter = await this.getConverter(sourceType, targetType);
      await converter.syncTarget(source, dispatch);
    } catch (err) {
      this.logger.error(
        `Error while syncing source: ${ref}. Error: ${getErrorMessage(err)}`,
      );
      throw err;
    }
  }

  private async fetchOne(
    { sourceType, targetType, query }: DataSyncManagerFetchTask,
    dispatch: DataSyncDispatch,
  ): Promise<void> {
    const ref = this.queryRef(query);
    this.logger.debug(`Fetching query: ${ref}`);
    try {
      const fetcher = await this.getFetcher(sourceType, targetType);
      await fetcher.fetch(query, dispatch);

      this.logger.debug(`Fetch successful for query: ${ref}`);
    } catch (err) {
      this.logger.error(
        `Error while fetching query: ${ref}. Error: ${getErrorMessage(err)}`,
      );
      throw err;
    }
  }

  private createQueue() {
    return new DataSyncManagerQueue({
      fetch: this.fetchOne.bind(this),
      sync: this.syncOne.bind(this),
      refService: this.referenceService,
    });
  }

  private dispatchAndFlush(
    tasks: DataSyncManagerTask[],
  ): Observable<DataSyncManagerResults> {
    if (tasks.length === 0) {
      return from([new DataSyncManagerResults()]);
    }
    const queue = this.createQueue();
    queue.dispatch(tasks);
    return queue.flush();
  }

  private syncTaskMapper<S, T>(sourceType: Type<S>, targetType: Type<T>) {
    return (source: S) =>
      new DataSyncManagerSyncTask(sourceType, targetType, source);
  }

  private fetchTaskMapper<S, T>(sourceType: Type<S>, targetType: Type<T>) {
    return (query: unknown) =>
      new DataSyncManagerFetchTask(sourceType, targetType, query);
  }

  sync<S, T>(
    sourceType: Type<S>,
    targetType: Type<T>,
    sources: ZeroOrMore<S>,
  ): Observable<DataSyncManagerResults> {
    return this.dispatchAndFlush(
      zeroOrMore(sources)
        .filter(Boolean)
        .map(this.syncTaskMapper(sourceType, targetType)),
    );
  }

  fetchAndSync<S, T>(
    sourceType: Type<S>,
    targetType: Type<T>,
    queries: ZeroOrMore<unknown>,
  ): Observable<DataSyncManagerResults> {
    return this.dispatchAndFlush(
      zeroOrMore(queries)
        .filter(Boolean)
        .map(this.fetchTaskMapper(sourceType, targetType)),
    );
  }
}

export const dataSyncProviders = <Source extends object, Target extends object>(
  source: Type<Source>,
  target: Type<Target>,
  fetcher: Type<DataSyncFetcherService>,
  converter: Type<DataSyncConverterService<Source, Target>>,
): Provider[] => [
  dataSyncFetcherProvider(source, target, fetcher),
  dataSyncConverterServiceProvider(source, target, converter),
];
