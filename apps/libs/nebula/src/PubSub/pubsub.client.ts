import { PubSub, Topic } from '@google-cloud/pubsub';
import { isFunction, isPlainObject, noop } from 'lodash';

import { Logger } from '@nestjs/common';
import {
  ClientProxy,
  Deserializer,
  ReadPacket,
  WritePacket,
} from '@nestjs/microservices';
import { Serializer } from '@nestjs/microservices/interfaces/serializer.interface';

import zeroOrMore, { ZeroOrMore } from '../utils/data/zeroOrMore';
import jsonStringify from '../utils/data/jsonStringify';

import { consoleAttributes } from './attributes/console-attributes';

type Attributes = Record<string, string>;
type AttributeSource = (packet: ReadPacket) => Record<string, string>;
type AttributeConfig = Attributes | AttributeSource;
export interface PubSubClientOptions<MessageFormat = ReadPacket> {
  clientName: string;
  topicName: string;
  projectId: string;
  attributes?: ZeroOrMore<AttributeConfig>;
  serializer?: Serializer<ReadPacket, MessageFormat>;
  deserializer?: Deserializer<MessageFormat, ReadPacket>;
}

const DEFAULT_ATTRIBUTES: AttributeSource = consoleAttributes;

const getAttribute = (attribute: Attributes): Attributes =>
  isPlainObject(attribute) ? attribute : {};

const resolveAttributeConfig = (
  attribute: AttributeConfig,
  packet: ReadPacket,
): Attributes =>
  getAttribute(isFunction(attribute) ? attribute(packet) : attribute);

export class PubSubClient<MessageFormat = ReadPacket> extends ClientProxy {
  private client: PubSub;
  private topic: Topic;
  private readonly clientName: string;
  private readonly topicName: string;
  private readonly projectId: string;
  private readonly attributes: AttributeConfig[];

  private readonly logger: Logger;

  constructor(options: PubSubClientOptions<MessageFormat>) {
    super();
    this.initializeSerializer(options);
    this.initializeDeserializer(options);
    this.clientName = options.clientName;
    this.topicName = options.topicName;
    this.projectId = options.projectId;
    this.logger = new Logger(`PubSubClient<${this.clientName}>`);
    this.attributes = zeroOrMore(options.attributes || DEFAULT_ATTRIBUTES);
  }

  async close() {
    // https://github.com/googleapis/nodejs-pubsub/issues/1463
    if (this.topic) {
      await new Promise<void>((r) => this.topic.flush(() => r()));
    }
    this.topic = null;
    if (this.client) {
      await new Promise<void>((r) => this.client.close(() => r()));
    }
    this.client = null;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async connect(): Promise<PubSub> {
    if (this.client) {
      return this.client;
    }

    this.client = this.createClient();

    this.topic = this.client.topic(this.topicName);

    return this.client;
  }

  createClient(): PubSub {
    return new PubSub({ projectId: this.projectId });
  }

  protected async dispatchEvent(packet: ReadPacket): Promise<any> {
    const pattern = this.normalizePattern(packet.pattern);
    this.logger.log(`Dispatching an event to PubSub ${pattern}`);
    const serializedPacket = this.serializer.serialize({
      ...packet,
      pattern,
    });
    this.logger.debug(`Serialized packet ${jsonStringify(serializedPacket)}`);

    if (this.topic) {
      await this.topic.publishMessage({
        json: serializedPacket,
        attributes: this.getAttributes(packet),
      });
    }
  }

  protected publish(
    partialPacket: ReadPacket,
    callback: (packet: WritePacket) => void,
  ): () => void {
    const pattern = this.normalizePattern(partialPacket.pattern);
    const message = `Attempted to publish message but only dispatch is supported (pattern: ${pattern})`;

    this.logger.error(message);

    callback({ err: new Error(message) });

    return noop;
  }

  private getAttributes(packet: ReadPacket): Attributes {
    return this.attributes.reduce<Attributes>(
      (attributes, config) => ({
        ...attributes,
        ...resolveAttributeConfig(config, packet),
      }),
      {},
    );
  }
}
