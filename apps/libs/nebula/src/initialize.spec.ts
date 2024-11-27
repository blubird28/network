import fs from 'fs';

import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { I18nService } from 'nestjs-i18n';
import yml from 'js-yaml';

import { NestFactory } from '@nestjs/core';
import {
  ClassSerializerInterceptor,
  INestApplication,
  LoggerService,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as NestSwagger from '@nestjs/swagger';
import { OpenAPIObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { I18nClsSetup } from '@libs/nebula/i18n/i18n-cls-setup';
import jsonStringify from '@libs/nebula/utils/data/jsonStringify';

import { MockerBuilder } from './testing/mocker/mocker.builder';
import initialize from './initialize';
import { HeartbeatService } from './Heartbeat/heartbeat.service';
import { HeartbeatResponseDto } from './Heartbeat/interfaces/dto/heartbeat-response.dto';
import { faker } from './testing/data/fakers';
import { BaseExceptionFilter, BaseValidationPipe } from './Error';
import { TracerInterceptor } from './Tracer/tracer.interceptor';
import * as PubSub from './PubSub/pubsub.server';
import { getArg } from './utils/argv';

jest.mock('./utils/argv', () => ({
  getArg: jest.fn(),
}));
const getArgMock = jest.mocked(getArg);

describe('initialize', () => {
  const fakeConfig = {
    APP_NAME: 'test',
    LOG_LEVEL: 'info',
    NODE_ENV: 'test',
    OPENAPI_TITLE: 'openapi title',
    OPENAPI_DESCRIPTION: 'openapi description',
    APP_PORT: 1234,
    PUBSUB_PROJECT: 'projectId',
    PUBSUB_ADDITIONAL_SUBSCRIPTIONS: [
      { topicName: 'topic1', subscriptionName: 'sub1' },
    ],
    PUBSUB_TOPIC: 'topic',
    PUBSUB_SUBSCRIPTION: 'sub',
  };
  let app: DeepMocked<INestApplication>;
  let documentBuilder;
  let openApiDocument;
  let loggerService;
  let pubSubServer;
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(fs.promises, 'writeFile').mockResolvedValue();
    const configService = MockerBuilder.mockConfigService(fakeConfig);
    const heartbeatService = createMock<HeartbeatService>({
      getHeartbeat() {
        return faker(HeartbeatResponseDto);
      },
    });
    const i18nService = createMock<I18nService>();

    app = createMock<INestApplication>({
      get(type) {
        if (type === ConfigService) {
          return configService;
        }
        if (type === HeartbeatService) {
          return heartbeatService;
        }
        if (type === I18nService) {
          return i18nService;
        }
        return createMock();
      },
    });
    documentBuilder = createMock<NestSwagger.DocumentBuilder>();
    openApiDocument = createMock<OpenAPIObject>();
    loggerService = createMock<LoggerService>();
    pubSubServer = createMock<PubSub.PubSubServer>();
    jest.spyOn(documentBuilder, 'setTitle').mockReturnValue(documentBuilder);
    jest
      .spyOn(documentBuilder, 'setDescription')
      .mockReturnValue(documentBuilder);
    jest.spyOn(documentBuilder, 'setVersion').mockReturnValue(documentBuilder);
    jest.spyOn(documentBuilder, 'build').mockReturnValue(openApiDocument);

    jest.spyOn(NestFactory, 'create').mockResolvedValue(app);
    jest.spyOn(NestSwagger, 'DocumentBuilder').mockReturnValue(documentBuilder);
    jest
      .spyOn(NestSwagger.SwaggerModule, 'createDocument')
      .mockReturnValue(openApiDocument);
    jest.spyOn(NestSwagger.SwaggerModule, 'setup').mockReturnValue(undefined);
    jest.spyOn(WinstonModule, 'createLogger').mockReturnValue(loggerService);
    jest.spyOn(PubSub, 'PubSubServer').mockReturnValue(pubSubServer);
  });

  it('initializes', async () => {
    expect.hasAssertions();
    const module = {};
    getArgMock.mockReturnValue(false);
    await initialize(module);

    expect(NestFactory.create).toHaveBeenCalledWith(module, expect.anything());
    expect(NestSwagger.DocumentBuilder).toHaveBeenCalledTimes(1);
    expect(documentBuilder.setTitle).toHaveBeenCalledWith(
      fakeConfig.OPENAPI_TITLE,
    );
    expect(documentBuilder.setDescription).toHaveBeenCalledWith(
      fakeConfig.OPENAPI_DESCRIPTION,
    );
    expect(documentBuilder.setVersion).toHaveBeenCalledWith('1.0.0');
    expect(documentBuilder.build).toHaveBeenCalledTimes(1);
    expect(NestSwagger.SwaggerModule.createDocument).toHaveBeenCalledWith(
      app,
      openApiDocument,
    );
    expect(NestSwagger.SwaggerModule.setup).toHaveBeenCalledWith(
      'api',
      app,
      openApiDocument,
    );
    expect(WinstonModule.createLogger).toHaveBeenCalledWith({
      level: fakeConfig.LOG_LEVEL,
      format: expect.anything(), // Logform doesn't expose the Format constructor for us directly, it is injected inside the scope of individual formatters
      transports: [expect.any(winston.transports.Console)],
    });
    expect(app.useLogger).toHaveBeenCalledWith(loggerService);
    expect(app.enableShutdownHooks).toHaveBeenCalledTimes(1);
    expect(app.useGlobalPipes).toHaveBeenCalledWith(
      expect.any(BaseValidationPipe),
    );
    expect(app.useGlobalFilters).toHaveBeenCalledWith(
      expect.any(BaseExceptionFilter),
    );
    expect(app.useGlobalInterceptors).toHaveBeenCalledWith(
      expect.any(TracerInterceptor),
      expect.any(ClassSerializerInterceptor),
    );
    expect(app.useGlobalGuards).toHaveBeenCalledWith(expect.any(I18nClsSetup));
    expect(app.listen).toHaveBeenCalledWith(fakeConfig.APP_PORT);
    expect(app.connectMicroservice).toHaveBeenCalledTimes(2);
    app.connectMicroservice.mock.calls.forEach((args) => {
      expect(args[1]).toStrictEqual({ inheritAppConfig: true });
    });
    expect(PubSub.PubSubServer).toHaveBeenCalledWith({
      topicName: fakeConfig.PUBSUB_TOPIC,
      subscriptionName: fakeConfig.PUBSUB_SUBSCRIPTION,
      projectId: fakeConfig.PUBSUB_PROJECT,
    });
    expect(PubSub.PubSubServer).toHaveBeenCalledWith({
      ...fakeConfig.PUBSUB_ADDITIONAL_SUBSCRIPTIONS[0],
      projectId: fakeConfig.PUBSUB_PROJECT,
    });
    expect(app.startAllMicroservices).toHaveBeenCalledTimes(1);
    expect(getArgMock).toHaveBeenCalledWith('output-docs');
  });

  it('outputs docs', async () => {
    expect.hasAssertions();
    const module = {};
    getArgMock.mockReturnValue(true);
    await initialize(module);

    expect(NestFactory.create).toHaveBeenCalledWith(module, expect.anything());
    expect(NestSwagger.DocumentBuilder).toHaveBeenCalledTimes(1);
    expect(documentBuilder.setTitle).toHaveBeenCalledWith(
      fakeConfig.OPENAPI_TITLE,
    );
    expect(documentBuilder.setDescription).toHaveBeenCalledWith(
      fakeConfig.OPENAPI_DESCRIPTION,
    );
    expect(documentBuilder.setVersion).toHaveBeenCalledWith('1.0.0');
    expect(documentBuilder.build).toHaveBeenCalledTimes(1);
    expect(NestSwagger.SwaggerModule.createDocument).toHaveBeenCalledWith(
      app,
      openApiDocument,
    );
    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('/docs/test.json'),
      jsonStringify(openApiDocument),
    );
    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('/docs/test.yml'),
      yml.dump(openApiDocument, {
        skipInvalid: true,
        noRefs: true,
      }),
    );
    expect(WinstonModule.createLogger).toHaveBeenCalledWith({
      level: fakeConfig.LOG_LEVEL,
      format: expect.anything(), // Logform doesn't expose the Format constructor for us directly, it is injected inside the scope of individual formatters
      transports: [expect.any(winston.transports.Console)],
    });
    expect(app.useLogger).toHaveBeenCalledWith(loggerService);
    expect(NestSwagger.SwaggerModule.setup).not.toHaveBeenCalled();
    expect(app.enableShutdownHooks).not.toHaveBeenCalled();
    expect(app.useGlobalPipes).not.toHaveBeenCalled();
    expect(app.useGlobalFilters).not.toHaveBeenCalled();
    expect(app.useGlobalInterceptors).not.toHaveBeenCalled();
    expect(app.useGlobalGuards).not.toHaveBeenCalled();
    expect(app.listen).not.toHaveBeenCalled();
    expect(app.connectMicroservice).not.toHaveBeenCalled();
    expect(PubSub.PubSubServer).not.toHaveBeenCalled();
    expect(PubSub.PubSubServer).not.toHaveBeenCalled();
    expect(app.startAllMicroservices).not.toHaveBeenCalled();
    expect(getArgMock).toHaveBeenCalledWith('output-docs');
  });
});
