import { EMPTY, expand, map, Observable } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { isArray } from 'lodash';

import { HttpService } from '@nestjs/axios';

import {
  DEFAULT_COUNT,
  DEFAULT_SKIP,
  MAXIMUM_COUNT,
  PaginationDto,
} from '../../dto/pagination.dto';
import { ZeroOrMore } from '../../utils/data/zeroOrMore';
import { WithPaginatedDto } from '../../dto/paginated.dto';

import { LoopbackFilter } from './LoopbackFilter';

export type ConfigGetter<T> = (
  previousPage?: AxiosResponse<T>,
) => AxiosRequestConfig | null;

/**
 * Usage:
 * provide a getPage function which will:
 *  - Given no input, get the Axios config to fetch the first page of results
 *  - Given a previous page of results, get the next page of results, if there is one (as an observable)
 *  - Otherwise, return an empty observable to stop (you can import the EMPTY constant from rxjs)
 **/
export const pager = <T>(service: HttpService, getConfig: ConfigGetter<T>) =>
  new Observable<AxiosResponse<T>>((observer) => {
    const getPage = (config: AxiosRequestConfig) =>
      service.request(config).pipe(
        map((response) => ({
          response,
          next: getConfig(response),
        })),
      );

    getPage(getConfig())
      .pipe(
        expand(({ next }) => (next ? getPage(next) : EMPTY)),
        map(({ response }) => response),
      )
      .subscribe(observer);
  });

const nextSkip = (
  isFirstPage: boolean,
  limit: number,
  lastSkip = 0,
): number => {
  if (isFirstPage) {
    return DEFAULT_SKIP;
  }
  return lastSkip + limit;
};

const isLastPage = (prevResults: ZeroOrMore<unknown>, limit: number): boolean =>
  prevResults && (!isArray(prevResults) || prevResults.length < limit);

export const loopbackPageGetter =
  <T = unknown>(
    url: string,
    limit = DEFAULT_COUNT,
    baseFilter: LoopbackFilter = new LoopbackFilter(),
    baseConfig: AxiosRequestConfig = {},
  ): ConfigGetter<T> =>
  (prev?: AxiosResponse<T>) =>
    isLastPage(prev?.data, limit)
      ? null
      : {
          ...baseConfig,
          url,
          params: {
            ...baseConfig.params,
            filter: LoopbackFilter.merge(baseFilter, {
              limit,
              skip: nextSkip(!prev, limit, prev?.config?.params?.filter?.skip),
            }),
          },
        };

export const constellationPageGetter =
  <T = unknown>(
    baseConfig: AxiosRequestConfig = {},
    limit = MAXIMUM_COUNT,
  ): ConfigGetter<WithPaginatedDto<T>> =>
  (prev?: AxiosResponse<WithPaginatedDto<T>>) =>
    isLastPage(prev?.data?.results, limit)
      ? null
      : {
          ...baseConfig,
          params: {
            ...baseConfig.params,
            ...new PaginationDto(
              limit,
              nextSkip(!prev, limit, prev?.config?.params?.skip),
            ),
          },
        };
