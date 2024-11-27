import { Message, PubSub, Subscription } from '@google-cloud/pubsub';
import { isError, isString, isUndefined } from 'lodash';

import {
  Deserializer,
  IncomingRequest,
  ReadPacket,
  Server,
} from '@nestjs/microservices';
import { ERROR_EVENT, MESSAGE_EVENT } from '@nestjs/microservices/constants';
import { Serializer } from '@nestjs/microservices/interfaces/serializer.interface';

import { withTracerSync } from '../Tracer';
import { TracerInformationFactory } from '../Tracer/tracer-information.factory';
import jsonStringify from '../utils/data/jsonStringify';

import { FALLBACK_ROUTE_PATTERN } from './constants';
import { GCPubSubContext } from './pubsub.context';

export interface PubSubServerOptions<MessageFormat = ReadPacket> {
  topicName: string;
  subscriptionName: string;
  projectId: string;
  serializer?: Serializer<ReadPacket, MessageFormat>;
  deserializer?: Deserializer<MessageFormat, ReadPacket>;
}
export class PubSubServer<MessageFormat = ReadPacket> extends Server {
  private readonly topicName: string;
  private readonly subscriptionName: string;
  private readonly projectId: string;
  private client: PubSub;
  private subscription: Subscription;
  constructor(options: PubSubServerOptions<MessageFormat>) {
    super();
    this.topicName = options.topicName;
    this.subscriptionName = options.subscriptionName;
    this.projectId = options.projectId;

    this.initializeSerializer(options);
    this.initializeDeserializer(options);
  }

  listen(callback: () => void) {
    this.client = this.createClient();
    this.subscription = this.client
      .topic(this.topicName)
      .subscription(this.subscriptionName);
    const errorLogger = this.getErrorLogger('Error handling message');
    this.subscription
      .on(MESSAGE_EVENT, (message: Message) => {
        this.handleMessage(message).catch(errorLogger);
      })
      .on(ERROR_EVENT, errorLogger);

    callback();
  }

  getErrorLogger(prefix: string) {
    return (err: unknown) => {
      if (isError(err)) {
        this.logger.error(`${prefix}: ${err.message}`);
        this.logger.error(err);
      } else {
        this.logger.error(`${prefix}: Unknown error`);
      }
    };
  }

  createClient(): PubSub {
    return new PubSub({ projectId: this.projectId });
  }

  async close() {
    // https://github.com/googleapis/nodejs-pubsub/issues/1463
    if (this.subscription) {
      await new Promise<void>((r) => this.subscription.close(() => r()));
    }
    this.subscription = null;
    if (this.client) {
      await new Promise<void>((r) => this.client.close(() => r()));
    }
    this.client = null;
  }

  private getPacket(message: Message): IncomingRequest {
    let rawData;
    try {
      rawData = message.data.toString();
      this.logger.debug(`Raw packet: ${rawData}`);
      const rawMessage = JSON.parse(rawData);
      return this.deserializer.deserialize(rawMessage) as IncomingRequest;
    } catch (err) {
      this.logger.error(`Failed to parse message data: "${rawData || ''}"`);

      throw err;
    }
  }

  public async handleMessage(message: Message) {
    const [pattern, packet, context] = this.readMessage(message);
    message.ack();
    await withTracerSync(
      TracerInformationFactory.buildFromGCPubSubContext(context),
      () => this.handleEvent(pattern, packet, context),
    );
  }

  private readMessage(message: Message): [string, ReadPacket, GCPubSubContext] {
    try {
      const packet = this.getPacket(message);
      this.logger.debug(`Deserialized packet: ${jsonStringify(packet)}`);
      const pattern = isString(packet.pattern)
        ? packet.pattern
        : JSON.stringify(packet.pattern);

      const context = new GCPubSubContext([message, pattern]);
      const correlationId = packet.id;

      if (!isUndefined(correlationId)) {
        this.logger.error(
          `Received a Message containing a correlation id, but request-response is not implemented. pattern: ${pattern}; id: ${correlationId}`,
        );
      }

      return [pattern, packet, context];
    } catch (err) {
      message.nack();
      this.getErrorLogger('Error while attempting to read message')(err);
      throw err;
    }
  }

  getHandlerByPattern(pattern: string) {
    return (
      super.getHandlerByPattern(pattern) ??
      super.getHandlerByPattern(FALLBACK_ROUTE_PATTERN)
    );
  }
}
