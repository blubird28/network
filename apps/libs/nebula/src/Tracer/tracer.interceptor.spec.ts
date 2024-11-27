import { createMock } from '@golevelup/ts-jest';
import { lastValueFrom, of } from 'rxjs';

import { CallHandler, ExecutionContext } from '@nestjs/common';

import { TracerInterceptor } from './tracer.interceptor';

describe('Tracer interceptor', () => {
  it('logs the request', async () => {
    expect.hasAssertions();
    const result = 'Hello world';
    const next = createMock<CallHandler>({ handle: () => of(result) });
    const interceptor = new TracerInterceptor();
    const logSpy = jest.spyOn(interceptor['logger'], 'log');

    expect(
      await lastValueFrom(
        interceptor.intercept(createMock<ExecutionContext>(), next),
      ),
    ).toBe(result);

    expect(logSpy).toBeCalledWith('Received message');
    expect(logSpy).toBeCalledWith('Request completed');
  });
});
