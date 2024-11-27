import winston from 'winston';

import { tracerLogTransformer } from './log-formatter';

import * as storage from '.';
import { TracerInformation } from '.';

describe('tracer log formatter', () => {
  it('adds relevant data to the log info', () => {
    jest
      .spyOn(storage, 'getTracer')
      .mockReturnValue(
        new TracerInformation('http', 'abc-123', 'POST /foo/bar'),
      );
    const info: winston.Logform.TransformableInfo = {
      message: 'message',
      level: 'info',
    };
    expect(tracerLogTransformer(info)).toBe(info);
    expect(info.level).toBe('info');
    expect(info.message).toBe('message');
    expect(info.tracerType).toBe('http');
    expect(info.tracerPattern).toBe('POST /foo/bar');
    expect(info.tracerId).toBe('abc-123');
  });
});
