import { map, OperatorFunction } from 'rxjs';
import { AxiosResponse } from 'axios';
import { identity } from 'lodash';

import { Type } from '@nestjs/common';

import toDto from '../../utils/data/toDto';
import { DEFAULT_DESERIALIZATION_OPTIONS } from '../constants';

type MaybeArray<P, T> = P extends any[] ? T[] : T;

export const serializeResponse = <T, D, P>(
  dtoType: Type<T>,
  project: (data: D) => P = identity,
  options = DEFAULT_DESERIALIZATION_OPTIONS,
): OperatorFunction<AxiosResponse<D>, MaybeArray<P, T>> =>
  map(
    ({ data }: AxiosResponse) =>
      toDto(project(data), dtoType, options) as MaybeArray<P, T>,
  );
