import { lastValueFrom, of } from 'rxjs';

import { getTracer, TracerInformation, withTracer } from '.';

describe('Tracer', () => {
  const expectUntraced = () => {
    const tracer = getTracer();
    expect(tracer.getType()).toBe('background');
    expect(tracer.getPattern()).toBe('-');
    expect(tracer.getTransactionId()).toBe('-');
  };

  it('returns the correct information inside a withTracer call and the default untraced information outside', async () => {
    expect.hasAssertions();
    // Before withTracer() it is untraced
    expectUntraced();
    const tracer = new TracerInformation('http', 'abc-123', 'POST /foo/bar');
    const pointcut = jest.fn(() => {
      // Inside withTracer() it is traced
      expect(getTracer()).toBe(tracer);
      return of('hello world');
    });
    expect(await lastValueFrom(withTracer(tracer, pointcut))).toBe(
      'hello world',
    );
    expect(pointcut).toBeCalledTimes(1);
    // After withTracer() it is untraced
    expectUntraced();
  });
  it('Does not overwrite the tracer if it is already defined', async () => {
    const outer = new TracerInformation('http', 'outer', 'POST /foo/bar');
    const inner = new TracerInformation('http', 'inner', 'POST /foo/bar');
    expectUntraced();
    expect(
      await lastValueFrom(
        withTracer(outer, () => {
          expect(getTracer()).toBe(outer);
          const result = withTracer(inner, () => {
            expect(getTracer()).toBe(outer);
            expect(getTracer().getTransactionId()).toBe('outer');
            return of('hello world');
          });
          expect(getTracer()).toBe(outer);
          expect(getTracer().getTransactionId()).toBe('outer');
          return result;
        }),
      ),
    ).toBe('hello world');
    expectUntraced();
  });
});
