import { DiscoveryService } from '@golevelup/nestjs-discovery';
import { isNil } from 'lodash';

import { ModuleRef } from '@nestjs/core';
import { Injectable, Logger } from '@nestjs/common';

import jsonStringify from '../utils/data/jsonStringify';
import getErrorMessage from '../utils/data/getErrorMessage';
import Errors from '../Error';
import zeroOrMore, { ZeroOrMore } from '../utils/data/zeroOrMore';
import { SerializedData, SerializedValue } from '../Serialization/serializes';
import { TemplateResolutionService } from '../Template/template-resolution.service';
import oneOrMore, { OneOrMore } from '../utils/data/oneOrMore';

import {
  ENRICHER_METADATA_KEY,
  NotificationEnricherMetadata,
} from './enricher.decorator';
import { GenericEnricher } from './generic-enricher.interface';

export interface EnrichCommand {
  key: string;
  handler: string;
  paramTemplate?: ZeroOrMore<SerializedValue>;
  resultTemplate?: SerializedData;
  dryRun?: boolean;
}

type EnrichedObject = Record<string, unknown>;

@Injectable()
export class EnricherService {
  private readonly logger: Logger = new Logger(EnricherService.name);

  private readonly enrichers = new Map<string, GenericEnricher>();
  constructor(
    private readonly discover: DiscoveryService,
    private readonly moduleRef: ModuleRef,
    private readonly templateService: TemplateResolutionService,
  ) {}

  async onModuleInit() {
    this.logger.debug('Discovering enrichers...');
    const providers =
      await this.discover.providersWithMetaAtKey<NotificationEnricherMetadata>(
        ENRICHER_METADATA_KEY,
      );

    this.logger.debug(`${providers.length} enrichers found`);

    providers.forEach(({ meta: { name }, discoveredClass }) => {
      this.logger.debug(`Adding enricher: ${name}`);
      this.enrichers.set(
        name,
        this.moduleRef.get<GenericEnricher>(discoveredClass.dependencyType),
      );
    });
  }

  getHandlers(): string[] {
    return [...this.enrichers.keys()];
  }

  private getEnricher({ handler }: EnrichCommand): GenericEnricher {
    const enricher = this.enrichers.get(handler);
    if (!enricher) {
      throw new Errors.EnricherDoesNotExist({ name: handler });
    }
    return enricher;
  }

  private getParams(command: EnrichCommand, input: object): SerializedValue[] {
    const { key, paramTemplate, handler, dryRun } = command;
    try {
      return zeroOrMore(
        this.templateService.resolve(paramTemplate, input, dryRun),
      );
    } catch (err) {
      this.logger.error(
        `Failed to get params: "${getErrorMessage(err)}". ${this.logSuffix(
          command,
        )}`,
      );
      this.logger.error(err);
      throw new Errors.FailedToResolveEnricherParams({ key, handler });
    }
  }

  private handleResult(
    command: EnrichCommand,
    input: object,
    result: unknown,
  ): unknown {
    this.logger.debug(`Handled successfully. ${this.logSuffix(command)}`);
    if (isNil(command.resultTemplate)) {
      return result;
    }
    this.logger.debug(`Resolving result template. ${this.logSuffix(command)}`);
    const resolved = this.templateService.resolve(
      command.resultTemplate,
      { ...input, result },
      command.dryRun,
    );
    this.logger.debug(`Resolved result template. ${this.logSuffix(command)}`);
    return resolved;
  }

  private logSuffix({ key, handler }: EnrichCommand, params?: object): string {
    const paramsText = params ? `, params: ${jsonStringify(params)}` : '';
    return `Key: '${key}', handler: '${handler}'${paramsText}.`;
  }

  private async enrichOne(
    command: EnrichCommand,
    input: object,
    target: EnrichedObject,
  ): Promise<EnrichedObject> {
    this.validateKey(command, target);
    const handler = this.getEnricher(command);
    this.logger.debug(`Found handler: ${command.handler}`);
    const params = this.getParams(command, input);
    this.logger.debug(`Got enricher params: ${jsonStringify(params)}`);
    if (command.dryRun) {
      this.logger.log(
        `Skipping enrichment as this is a dry run. ${this.logSuffix(command)}`,
      );
      return target;
    }

    try {
      target[command.key] = this.handleResult(
        command,
        input,
        await handler.enrich(...params),
      );
      this.logger.debug(`Enriched successfully. ${this.logSuffix(command)}`);
      return target;
    } catch (err) {
      this.logger.error(
        `Failed to enrich notification: "${getErrorMessage(
          err,
        )}". ${this.logSuffix(command, params)}`,
      );
      throw new Errors.EnrichmentFailed({
        key: command.key,
        handler: command.handler,
      });
    }
  }

  async enrich(
    commands: OneOrMore<EnrichCommand>,
    input: object,
    target: EnrichedObject = {},
  ): Promise<EnrichedObject> {
    for (const command of oneOrMore(commands)) {
      this.logger.debug(`Enriching. ${this.logSuffix(command)}`);
      await this.enrichOne(command, input, target);
    }
    this.logger.debug(`Finished enriching. ${jsonStringify(target)}`);

    return target;
  }

  private validateKey(command: EnrichCommand, target: EnrichedObject) {
    const { key, handler } = command;
    if (Object.hasOwn(target, key)) {
      this.logger.error(
        `Cannot enrich notification: Key "${key}" already exists on the target. ${this.logSuffix(
          command,
        )}`,
      );
      throw new Errors.EnrichmentKeyClash({ key, handler });
    }
  }
}
