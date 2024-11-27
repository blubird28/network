import { RPC_GC_PUBSUB_ATTRIBUTE } from '../../Tracer/constants';
import { getTracer } from '../../Tracer';

export const consoleAttributes = () => {
  return {
    [RPC_GC_PUBSUB_ATTRIBUTE]: getTracer().getTransactionId(),
  };
};
