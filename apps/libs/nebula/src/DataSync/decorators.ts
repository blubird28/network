import { InjectionToken, SetMetadata, Type } from '@nestjs/common';

import {
  DATA_SYNC_CONVERTER_METADATA_KEY,
  DATA_SYNC_FETCHER_METADATA_KEY,
} from './constants';
import { dataSyncConverterServiceToken } from './converter.service';
import { dataSyncFetcherServiceToken } from './fetcher.service';

export interface DataSyncServiceMeta<Source, Target> {
  token: InjectionToken;
  source: Type<Source>;
  target: Type<Target>;
}

export const DataSyncConverter = <S, T>(
  source: Type<S>,
  target: Type<T>,
  token: InjectionToken = dataSyncConverterServiceToken(source, target),
): ClassDecorator =>
  SetMetadata<symbol, DataSyncServiceMeta<S, T>>(
    DATA_SYNC_CONVERTER_METADATA_KEY,
    { token, source, target },
  );

export const DataSyncFetcher = <S, T>(
  source: Type<S>,
  target: Type<T>,
  token: InjectionToken = dataSyncFetcherServiceToken(source, target),
): ClassDecorator =>
  SetMetadata<symbol, DataSyncServiceMeta<S, T>>(
    DATA_SYNC_FETCHER_METADATA_KEY,
    { token, source, target },
  );
