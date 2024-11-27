import { isString, toUpper } from 'lodash';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Job } from 'bullmq';

import { HttpArgumentsHost, RpcArgumentsHost } from '@nestjs/common/interfaces';
import { ExecutionContext } from '@nestjs/common';

import { GCPubSubContext } from '../PubSub/pubsub.context';

import { HTTP_HEADER, RPC_GC_PUBSUB_ATTRIBUTE } from './constants';

import { TracerInformation } from './index';

export class TracerInformationFactory {
  static buildFromContext(context: ExecutionContext): TracerInformation {
    return new TracerInformation(
      context.getType(),
      this.getIdFromContext(context) || this.getDefaultId(),
      this.getPatternFromContext(context) || this.getDefaultPattern(),
    );
  }
  static buildFromGCPubSubContext(context: GCPubSubContext): TracerInformation {
    return new TracerInformation(
      'rpc',
      this.getIdFromGCPubSubContext(context) || this.getDefaultId(),
      this.getPatternFromGCPubSubContext(context) || this.getDefaultPattern(),
    );
  }
  static buildFromRequest(request: Request): TracerInformation {
    return new TracerInformation(
      'http',
      this.getIdFromRequest(request) || this.getDefaultId(),
      this.getPatternFromRequest(request) || this.getDefaultPattern(),
    );
  }
  static buildFromJob(job: Job): TracerInformation {
    return new TracerInformation(
      'task',
      this.getDefaultId(),
      this.getPatternFromJob(job) || this.getDefaultPattern(),
    );
  }

  static getIdFromContext(context: ExecutionContext): string {
    switch (context.getType()) {
      case 'rpc':
        return this.getIdFromRpc(context.switchToRpc());
      case 'http':
        return this.getIdFromHttp(context.switchToHttp());
    }
    return undefined;
  }

  static getPatternFromContext(context: ExecutionContext): string {
    switch (context.getType()) {
      case 'rpc':
        return this.getPatternFromRpc(context.switchToRpc());
      case 'http':
        return this.getPatternFromHttp(context.switchToHttp());
    }
    return undefined;
  }

  static getDefaultId(): string {
    return uuidv4();
  }

  static getDefaultPattern(): string {
    return '-';
  }

  static getIdFromRpc(argumentsHost: RpcArgumentsHost): string {
    const context = argumentsHost.getContext();
    if (context instanceof GCPubSubContext) {
      return this.getIdFromGCPubSubContext(context);
    }

    return undefined;
  }

  static getIdFromGCPubSubContext(context: GCPubSubContext): string {
    const fromAttributes =
      context.getMessage().attributes[RPC_GC_PUBSUB_ATTRIBUTE];
    if (isString(fromAttributes)) {
      return fromAttributes;
    }

    return undefined;
  }

  static getIdFromHttp(argumentsHost: HttpArgumentsHost): string {
    return this.getIdFromRequest(argumentsHost.getRequest<Request>());
  }

  static getIdFromRequest(request: Request): string {
    const fromHeader = request.header(HTTP_HEADER);
    if (isString(fromHeader)) {
      return fromHeader;
    }

    return undefined;
  }

  static getPatternFromRpc(argumentsHost: RpcArgumentsHost): string {
    return this.getPatternFromGCPubSubContext(argumentsHost.getContext());
  }

  static getPatternFromGCPubSubContext(context: GCPubSubContext): string {
    const fromPattern = context.getPattern?.();
    if (fromPattern && isString(fromPattern)) {
      return fromPattern;
    }

    return undefined;
  }

  static getPatternFromHttp(argumentsHost: HttpArgumentsHost): string {
    return this.getPatternFromRequest(argumentsHost.getRequest<Request>());
  }

  static getPatternFromRequest(request: Request): string {
    return `${toUpper(request.method)} ${request.baseUrl}${request.path}`;
  }

  static getPatternFromJob(job: Job): string {
    return `${job.queueName}/${job.name}/${job.id}`;
  }
}
