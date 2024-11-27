import winston from 'winston';

import { getTracer } from '.';

export const tracerLogTransformer: winston.Logform.TransformFunction = (
  info,
) => {
  const tracer = getTracer();
  info.tracerId = tracer.getTransactionId();
  info.tracerType = tracer.getType();
  info.tracerPattern = tracer.getPattern();
  return info;
};

export const tracerLog = winston.format(tracerLogTransformer)();
