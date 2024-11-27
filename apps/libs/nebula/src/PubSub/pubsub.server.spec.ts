import { createMock } from '@golevelup/ts-jest';
import { Message, PubSub, Subscription, Topic } from '@google-cloud/pubsub';

import { Deserializer, ReadPacket } from '@nestjs/microservices';

import { FALLBACK_ROUTE_PATTERN } from '@libs/nebula/PubSub/constants';
import { TracerInformationFactory } from '@libs/nebula/Tracer/tracer-information.factory';

import * as tracer from '../Tracer';
import { TracerInformation } from '../Tracer';

import { GCPubSubContext } from './pubsub.context';
import { PubSubServer, PubSubServerOptions } from './pubsub.server';

jest.mock('../Tracer');
const withTracerSyncMock = jest.mocked(tracer.withTracerSync);

describe('PubSub Server', () => {
  const expectedPattern = 'pattern';
  const expectedData = 'data';
  const expectedPacket = { data: expectedData, pattern: expectedPattern };
  const alternativeFormatPacket = {
    payload: expectedData,
    bucket: expectedPattern,
  };
  const deserializer: Deserializer<typeof alternativeFormatPacket, ReadPacket> =
    {
      deserialize: (value) => ({
        data: value['payload'],
        pattern: value['bucket'],
      }),
    };
  const setupMessageAndContext = (packet: unknown = expectedPacket) => {
    const message = createMock<Message>({
      data: Buffer.from(JSON.stringify(packet)),
    });
    const context = new GCPubSubContext([message, 'pattern']);

    return { message, context };
  };
  const setupMocks = async <T>(
    options: Partial<PubSubServerOptions<T>> = {},
  ) => {
    const subscription = createMock<Subscription>({
      close: (cb) => cb(),
    });
    const topic = createMock<Topic>({
      subscription: () => subscription,
    });
    const client = createMock<PubSub>({
      topic: () => topic,
      close: (cb) => cb(null, null),
    });

    const service = new PubSubServer<T>({
      projectId: 'project',
      topicName: 'topic',
      subscriptionName: 'subscription',
      ...options,
    });

    jest.spyOn(service, 'createClient').mockReturnValue(client);
    jest.spyOn(service, 'handleEvent').mockResolvedValue(undefined);

    await new Promise<void>((r) => service.listen(r));

    return { service, client, subscription, topic };
  };
  const expectedTracer = new TracerInformation(
    'rpc',
    'abc-123',
    expectedPattern,
  );

  beforeEach(() => {
    jest.resetAllMocks();
    withTracerSyncMock.mockImplementation((_tracer, callback) => callback());
    jest
      .spyOn(TracerInformationFactory, 'buildFromGCPubSubContext')
      .mockReturnValue(expectedTracer);
  });

  it('handles a message', async () => {
    const { service } = await setupMocks();
    const { message, context } = setupMessageAndContext();

    await service.handleMessage(message);

    expect(service.handleEvent).toHaveBeenCalledWith(
      expectedPattern,
      expectedPacket,
      context,
    );

    expect(message.ack).toHaveBeenCalledTimes(1);
    expect(message.nack).not.toHaveBeenCalled();
    expect(withTracerSyncMock).toHaveBeenCalledWith(
      expectedTracer,
      expect.any(Function),
    );
    expect(
      TracerInformationFactory.buildFromGCPubSubContext,
    ).toHaveBeenCalledWith(context);
  });

  it('handles custom deserialization (if configured)', async () => {
    const { service } = await setupMocks({ deserializer });
    const { message, context } = setupMessageAndContext(
      alternativeFormatPacket,
    );

    await service.handleMessage(message);

    expect(service.handleEvent).toHaveBeenCalledWith(
      expectedPattern,
      expectedPacket,
      context,
    );

    expect(message.ack).toHaveBeenCalledTimes(1);
    expect(message.nack).not.toHaveBeenCalled();
    expect(withTracerSyncMock).toHaveBeenCalledWith(
      expectedTracer,
      expect.any(Function),
    );
    expect(
      TracerInformationFactory.buildFromGCPubSubContext,
    ).toHaveBeenCalledWith(context);
  });

  it('if the message is parsed successfully but an error occurs while handling it, it is still acknowledged', async () => {
    const { service } = await setupMocks();
    jest
      .spyOn(service, 'handleEvent')
      .mockRejectedValue(new Error('Computer says no'));
    const { message, context } = setupMessageAndContext();

    await expect(service.handleMessage(message)).rejects.toThrowError(
      'Computer says no',
    );

    expect(service.handleEvent).toHaveBeenCalledWith(
      expectedPattern,
      expectedPacket,
      context,
    );

    expect(message.ack).toHaveBeenCalledTimes(1);
    expect(message.nack).not.toHaveBeenCalled();
    expect(withTracerSyncMock).toHaveBeenCalledWith(
      expectedTracer,
      expect.any(Function),
    );
    expect(
      TracerInformationFactory.buildFromGCPubSubContext,
    ).toHaveBeenCalledWith(context);
  });

  it("if the message cannot be parsed into a ReadPacket, nack's it", async () => {
    const { service } = await setupMocks({ deserializer });
    const message = createMock<Message>({
      data: Buffer.from('invalid json!'),
    });

    await expect(service.handleMessage(message)).rejects.toThrowError();

    expect(service.handleEvent).not.toHaveBeenCalled();

    expect(message.nack).toHaveBeenCalledTimes(1);
    expect(message.ack).not.toHaveBeenCalled();
  });

  it('cleans up on shutdown', async () => {
    const { service, subscription, client } = await setupMocks();
    await service.close();
    expect(subscription.close).toBeCalledTimes(1);
    expect(client.close).toBeCalledTimes(1);
  });

  it('uses the defined handler if it exists', async () => {
    const { service } = await setupMocks();
    const fallback = jest.fn();
    const handler = jest.fn();
    service.addHandler(FALLBACK_ROUTE_PATTERN, fallback);
    service.addHandler('pattern', handler);

    expect(service.getHandlerByPattern('pattern')).toBe(handler);
  });

  it('uses the fallback route if it exists and a handler is not found', async () => {
    const { service } = await setupMocks();
    const fallback = jest.fn();
    const handler = jest.fn();
    service.addHandler(FALLBACK_ROUTE_PATTERN, fallback);
    service.addHandler('pattern', handler);

    expect(service.getHandlerByPattern('other-pattern')).toBe(fallback);
  });

  it('uses no route if no fallback exists and a handler is not found', async () => {
    const { service } = await setupMocks();
    const handler = jest.fn();
    service.addHandler('pattern', handler);

    expect(service.getHandlerByPattern('other-pattern')).toBe(null);
  });
});
