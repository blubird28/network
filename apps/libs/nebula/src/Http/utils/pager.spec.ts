import { from, lastValueFrom, map, toArray } from 'rxjs';
import { AxiosResponse } from 'axios';
import { createMock, DeepMocked } from '@golevelup/ts-jest';

import { HttpService } from '@nestjs/axios';

import { LoopbackFilter } from './LoopbackFilter';
import { constellationPageGetter, loopbackPageGetter, pager } from './pager';

describe('pager', () => {
  let service: DeepMocked<HttpService>;
  const expectedPages = [
    ['a', 'b', 'c'],
    ['d', 'e', 'f'],
    ['g', 'h', 'i'],
    ['j'],
  ];

  const mockService = (pages) => {
    let i = 0;
    return createMock<HttpService>({
      request: (config) => {
        const response = createMock<AxiosResponse>({ config });
        response.data = pages[i++];
        return from([response]);
      },
    });
  };

  it('works with loopback strategy', async () => {
    service = mockService(expectedPages);
    expect(
      await lastValueFrom(
        pager(
          service,
          loopbackPageGetter(
            '/',
            3,
            new LoopbackFilter({ where: { foo: 'bar' } }),
            {
              headers: { 'user-agent': 'bond' },
            },
          ),
        ).pipe(
          map((response) => response.data),
          toArray(),
        ),
      ),
    ).toStrictEqual(expectedPages);

    expect(service.request).toBeCalledTimes(4);
    expectedPages.forEach((ignored, pageIdx) => {
      expect(service.request).toBeCalledWith({
        headers: { 'user-agent': 'bond' },
        params: {
          filter: new LoopbackFilter({
            where: { foo: 'bar' },
            limit: 3,
            skip: pageIdx * 3,
          }),
        },
        url: '/',
      });
    });
  });

  it('works with constellation strategy', async () => {
    const expected = expectedPages.map((page, i) => ({
      skip: i * 3,
      count: 3,
      total: 10,
      results: page,
    }));
    service = mockService(expected);
    expect(
      await lastValueFrom(
        pager(
          service,
          constellationPageGetter(
            {
              url: '/',
              headers: { 'user-agent': 'bond' },
            },
            3,
          ),
        ).pipe(
          map((response) => response.data),
          toArray(),
        ),
      ),
    ).toStrictEqual(expected);

    expect(service.request).toBeCalledTimes(4);
    expectedPages.forEach((ignored, pageIdx) => {
      expect(service.request).toBeCalledWith({
        headers: { 'user-agent': 'bond' },
        params: {
          count: 3,
          skip: pageIdx * 3,
        },
        url: '/',
      });
    });
  });
});
