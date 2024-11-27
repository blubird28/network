import { InjectionToken, Provider, Type } from '@nestjs/common';

import { DataSyncDispatch } from './queue';
import { FETCHER_SERVICE_TOKEN_PREFIX } from './constants';

export interface DataSyncFetcherService {
  /**
   * Fetch zero or more instances of Source from the legacy data store if it exists
   * May be called with arbitrary data (eg. IDs, Query DTO's like UsernameDto, a number of records to fetch, etc)
   * Implementation is responsible for:
   * * handling any expected data types for query
   * * throwing on unsupported types
   * * dispatching sync tasks (or further fetch tasks) that should come as a result of the fetch
   */
  fetch(query: unknown, dispatch: DataSyncDispatch): Promise<void>;
}

export const dataSyncFetcherServiceToken = (source: Type, target: Type) =>
  Symbol.for(
    [FETCHER_SERVICE_TOKEN_PREFIX, source.name, target.name].join('_'),
  );

export const dataSyncFetcherProvider = (
  source: Type,
  target: Type,
  useClass: Type<DataSyncFetcherService>,
  provide: InjectionToken = dataSyncFetcherServiceToken(source, target),
): Provider => ({ provide, useClass });
