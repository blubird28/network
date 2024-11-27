import path from 'path';
import fs from 'fs';

import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';
import { I18nService } from 'nestjs-i18n';
import yml from 'js-yaml';

import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  ClassSerializerInterceptor,
  INestApplication,
  INestMicroservice,
  LoggerService,
  NestApplicationOptions,
} from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

import * as transformer from '@libs/nebula/class-transformer';

import { getArg } from './utils/argv';
import { DocumentedConfig } from './Config/schemas/documented.schema';
import { JWTConfig } from './Config/schemas/jwt.schema';
import {
  AdditionalPubSubServerConfig,
  PubSubServerConfig,
} from './Config/schemas/pub-sub-server.schema';
import { BaseValidationPipe, BaseExceptionFilter } from './Error';
import { PubSubServer } from './PubSub/pubsub.server';
import { BaseConfig } from './Config/schemas/base.schema';
import { HeartbeatService } from './Heartbeat/heartbeat.service';
import { tracerLog } from './Tracer/log-formatter';
import { AppConfig } from './Config/schemas/app.schema';
import { I18nClsSetup } from './i18n/i18n-cls-setup';
import { TracerInterceptor } from './Tracer/tracer.interceptor';
import { TracerClsMiddleware } from './Tracer/cls.middleware';
import { pathJoin } from './utils/data/pathJoin';
import jsonStringify from './utils/data/jsonStringify';

const createLogger = (app: INestApplication) => {
  const configService = app.get<ConfigService<BaseConfig>>(ConfigService);
  const logLevel = configService.get('LOG_LEVEL');
  const env = configService.get('NODE_ENV');

  // Attach the logger, fire logs buffered during app creation
  return WinstonModule.createLogger({
    level: logLevel,
    format: winston.format.combine(
      tracerLog,
      env === 'production' ? winston.format.json() : winston.format.simple(),
    ),
    transports: [new winston.transports.Console()],
  });
};

const buildOpenAPIDocument = (
  app: INestApplication,
  logger: LoggerService,
): OpenAPIObject | undefined => {
  const configService =
    app.get<ConfigService<DocumentedConfig & JWTConfig>>(ConfigService);
  const title = configService.get('OPENAPI_TITLE');
  const description = configService.get('OPENAPI_DESCRIPTION');
  const server = configService.get('OPENAPI_SERVER');
  const serverDescription =
    configService.get('OPENAPI_SERVER_DESCRIPTION') || undefined;
  const hasJWT = !!configService.get('JWT_ISSUER');

  logger.log(
    `OpenAPI setup - title: "${title ?? '(unset)'}"; description: "${
      description ?? '(unset)'
    }"`,
  );

  if (title && description) {
    const version = app
      .get<HeartbeatService>(HeartbeatService)
      .getHeartbeat().version;
    const documentBuilder = new DocumentBuilder()
      .setTitle(title)
      .setDescription(description)
      .setVersion(version);

    if (hasJWT) {
      logger.log(`OpenAPI setup - Bearer auth enabled`);
      documentBuilder.addBearerAuth();
      documentBuilder.addSecurityRequirements('bearer');
    }

    if (server) {
      const serverPath = pathJoin(server);
      logger.log(`OpenAPI setup - alternative server enabled at ${serverPath}`);
      documentBuilder.addServer(serverPath, serverDescription);
    }
    return SwaggerModule.createDocument(app, documentBuilder.build());
  } else {
    logger.log('OpenAPI setup - skipping...');
  }
};

const maybeSetupDocs = (app: INestApplication, logger: LoggerService) => {
  const docs = buildOpenAPIDocument(app, logger);
  if (docs) {
    SwaggerModule.setup('api', app, docs);
  }
};

const maybeConnectPubSub = async (
  app: INestApplication,
  logger: LoggerService,
): Promise<INestMicroservice[]> => {
  const configService =
    app.get<ConfigService<PubSubServerConfig>>(ConfigService);
  const projectId = configService.get('PUBSUB_PROJECT', false);

  if (projectId) {
    const configs: AdditionalPubSubServerConfig[] = [
      ...configService.get('PUBSUB_ADDITIONAL_SUBSCRIPTIONS', []),
    ];
    const topicName = configService.get('PUBSUB_TOPIC', false);
    const subscriptionName = configService.get('PUBSUB_SUBSCRIPTION', false);
    if (topicName && subscriptionName) {
      configs.unshift({ topicName, subscriptionName });
    }
    if (configs.length > 0) {
      const microservices = configs.map(({ topicName, subscriptionName }) => {
        const microservice = app.connectMicroservice<MicroserviceOptions>(
          {
            strategy: new PubSubServer({
              topicName,
              subscriptionName,
              projectId,
            }),
          },
          { inheritAppConfig: true },
        );

        logger.log(
          `PubSub Microservice listening on topic: ${topicName}, subscription: ${subscriptionName}`,
          'NestApplication',
        );

        return microservice;
      });

      await app.startAllMicroservices();

      return microservices;
    }
  }

  return [];
};

const maybeSetupApp = async (app: INestApplication, logger: LoggerService) => {
  const configService = app.get<ConfigService<AppConfig>>(ConfigService);
  const port = configService.get('APP_PORT', false);

  // Enable shutdown hooks so we can log termination signals
  app.enableShutdownHooks();

  if (port) {
    // Setup cls early for HTTP(S) requests
    app.use(new TracerClsMiddleware().use);
    // Use validation across the app
    app.useGlobalPipes(new BaseValidationPipe());
    app.useGlobalFilters(new BaseExceptionFilter());
    // Add the i18n service to the CLS context
    app.useGlobalGuards(new I18nClsSetup(app.get(I18nService)));
    app.useGlobalInterceptors(
      new TracerInterceptor(),
      new ClassSerializerInterceptor(app.get(Reflector), {
        transformerPackage: transformer,
      }),
    );

    maybeSetupDocs(app, logger);

    // Start listening, log the port we attached to
    await app.listen(port);
    logger.log(`REST Service listening on port: ${port}`, 'NestApplication');
  }
};

const writeDocs = async (
  app: INestApplication,
  doc: OpenAPIObject,
  logger: LoggerService,
) => {
  const configService = app.get<ConfigService<BaseConfig>>(ConfigService);
  const appName = configService.get('APP_NAME');
  const docsDirectory = path.resolve(process.cwd(), 'docs');
  const jsonFile = path.join(docsDirectory, `${appName}.json`);
  const ymlFile = path.join(docsDirectory, `${appName}.yml`);

  logger.log(`Writing docs in ${docsDirectory}`);
  await fs.promises.writeFile(jsonFile, jsonStringify(doc));
  await fs.promises.writeFile(
    ymlFile,
    yml.dump(doc, {
      skipInvalid: true,
      noRefs: true,
    }),
  );

  logger.log('Wrote docs successfully');
};
const outputDocs = async (app: INestApplication, logger: LoggerService) => {
  try {
    const docs = buildOpenAPIDocument(app, logger);
    if (docs) {
      await writeDocs(app, docs, logger);
    } else {
      logger.error('No docs were written - were OPENAPI_* variables not set?');
    }
  } catch (e) {
    logger.error('Error while building docs');
    logger.error(e);
    throw e;
  } finally {
    await app.close();
  }
};

export interface InitializeContext {
  app: INestApplication;
  microservices: INestMicroservice[];
  logger: LoggerService;
}

const initialize = async (
  AppModule,
  options: NestApplicationOptions = {},
): Promise<InitializeContext> => {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    ...options,
  });
  const logger = createLogger(app);
  app.useLogger(logger);

  if (getArg('output-docs')) {
    await outputDocs(app, logger);
    return { app, logger, microservices: [] };
  }
  await maybeSetupApp(app, logger);
  const microservices = await maybeConnectPubSub(app, logger);

  return { app, microservices, logger };
};

export default initialize;
