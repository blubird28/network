import { createMock } from '@golevelup/ts-jest';
import { PubSub, Topic } from '@google-cloud/pubsub';
import { lastValueFrom } from 'rxjs';

import { TracerInformation, withTracer } from '../Tracer';

import { PubSubClient, PubSubClientOptions } from './pubsub.client';

describe('PubSub Client', () => {
  const setupMocks = async <T>(
    options: Partial<PubSubClientOptions<T>> = {},
  ) => {
    const topic = createMock<Topic>({
      flush: (cb) => cb(null, null),
    });

    const client = createMock<PubSub>({
      topic: () => topic,
      close: (cb) => cb(null, null),
    });

    const service = new PubSubClient<T>({
      projectId: 'project',
      topicName: 'topic',
      clientName: 'client',
      ...options,
    });

    jest.spyOn(service, 'createClient').mockReturnValue(client);

    await service.connect();

    return { service, topic, client };
  };

  it('includes transaction id as an attribute (by default)', async () => {
    const { service, topic } = await setupMocks();
    await lastValueFrom(
      withTracer(
        new TracerInformation('background', 'transactionId', '-'),
        () => service.emit('pattern', 'data'),
      ),
    );

    expect(topic.publishMessage).toHaveBeenCalledWith({
      attributes: { transactionId: 'transactionId' },
      json: { data: 'data', pattern: 'pattern' },
    });
  });

  it('includes other attributes (if configured)', async () => {
    const { service, topic } = await setupMocks({
      attributes: [jest.fn(() => ({ foo: 'boo' })), { bar: 'far' }],
    });
    await lastValueFrom(service.emit('pattern', 'data'));

    expect(topic.publishMessage).toHaveBeenCalledWith({
      attributes: { foo: 'boo', bar: 'far' },
      json: { data: 'data', pattern: 'pattern' },
    });
  });

  it('includes no attributes (if configured)', async () => {
    const { service, topic } = await setupMocks({
      attributes: [],
    });
    await lastValueFrom(service.emit('pattern', 'data'));

    expect(topic.publishMessage).toHaveBeenCalledWith({
      attributes: {},
      json: { data: 'data', pattern: 'pattern' },
    });
  });

  it('does custom deserialization (if configured)', async () => {
    const { service, topic } = await setupMocks({
      attributes: [],
      serializer: {
        serialize: (value) => ({ bucket: value.pattern, payload: value.data }),
      },
    });
    await lastValueFrom(service.emit('pattern', 'data'));

    expect(topic.publishMessage).toHaveBeenCalledWith({
      attributes: {},
      json: { payload: 'data', bucket: 'pattern' },
    });
  });

  it('send is not allowed', async () => {
    const { service } = await setupMocks();
    await expect(
      lastValueFrom(service.send('pattern', 'data')),
    ).rejects.toMatchInlineSnapshot(
      `[Error: Attempted to publish message but only dispatch is supported (pattern: pattern)]`,
    );
  });

  it('cleans up on shutdown', async () => {
    const { service, topic } = await setupMocks();
    await service.close();
    expect(topic.flush).toBeCalled();
  });
});
