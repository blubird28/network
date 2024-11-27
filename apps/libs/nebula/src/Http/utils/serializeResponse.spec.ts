import { from, lastValueFrom, toArray } from 'rxjs';
import { createMock } from '@golevelup/ts-jest';

import { serializeResponse } from './serializeResponse';

describe('serializeResponse', () => {
  it('creates a default serializer', async () => {
    expect(
      await lastValueFrom(
        from([1, 2, 3, 4].map((data) => createMock({ data }))).pipe(
          serializeResponse(String),
          toArray(),
        ),
      ),
    ).toStrictEqual(['1', '2', '3', '4']);
  });

  it('creates a with a project function serializer', async () => {
    expect(
      await lastValueFrom(
        from([1, 2, 3, 4].map((data) => createMock({ data }))).pipe(
          serializeResponse(String, (data: number) => data * 2),
          toArray(),
        ),
      ),
    ).toStrictEqual(['2', '4', '6', '8']);
  });
});
