import { Request } from 'express';
import { isEmpty } from 'lodash';
import { lastValueFrom } from 'rxjs';

import { ExecutionContext, Inject, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as BaseAuthGuard } from '@nestjs/passport';

import {
  PrincipalQueryDto,
  UnauthenticatedPrincipalQueryDto,
} from '../dto/principal-query.dto';
import getErrorMessage from '../utils/data/getErrorMessage';
import cleanAxiosError from '../utils/data/cleanAxiosError';
import { AccessCheckDto } from '../dto/access-check.dto';
import zeroOrMore from '../utils/data/zeroOrMore';
import jsonStringify from '../utils/data/jsonStringify';
import { IdentityHttpService } from '../Http/Identity/identity-http.service';
import Errors from '../Error';
import { AccessRequestDto } from '../dto/access-request.dto';
import { AccessRequestResultDto } from '../dto/access-request-result.dto';
import { PrincipalDto } from '../dto/identity/principal.dto';
import completionOf from '../utils/observables/completionOf';

import { RequestUser } from './jwt.strategy';
import { AccessCheckFunc } from './pbac.decorator';
import {
  APIKEY_STRATEGY_NAME,
  CONSOLE_STRATEGY_NAME,
  DEFAULT_FEATURE_NAME,
  IS_PUBLIC_KEY,
  NO_PBAC_KEY,
  PBAC_KEY,
  SHIELD_STRATEGY_NAME,
} from './constants';

export type RequestWithUser = Request & {
  user?: RequestUser;
};
export type RequestWithPrincipal = Request & {
  principal: PrincipalDto;
};

export const DEFAULT_FEATURE_CHECK =
  AccessCheckDto.feature(DEFAULT_FEATURE_NAME);
export class AuthGuard extends BaseAuthGuard([
  CONSOLE_STRATEGY_NAME,
  SHIELD_STRATEGY_NAME,
  APIKEY_STRATEGY_NAME,
]) {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    @Inject(Reflector)
    private readonly reflector: Reflector,
    private readonly identity: IdentityHttpService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    if (!this.isHttpContext(context)) {
      this.logger.verbose('Skipping auth - non http execution context');
      return true;
    }

    try {
      await completionOf(super.canActivate(context));
    } catch (err) {
      if (!this.isHandlerMarkedAsPublic(context)) {
        this.logger.error('Failed to authenticate user');
        this.logger.error(cleanAxiosError(err));
        throw new Errors.Unauthorized();
      }
      this.logger.verbose('Skipping auth - handler is marked as public');
    }

    if (this.isHandlerMarkedAsNoPBAC(context)) {
      return true;
    }

    return this.performPbacChecksForHandler(context);
  }

  private isHttpContext(context: ExecutionContext): boolean {
    return context.getType() === 'http';
  }

  private isHandlerMarkedAsPublic(context: ExecutionContext): boolean {
    return !!this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private isHandlerMarkedAsNoPBAC(context: ExecutionContext): boolean {
    return !!this.reflector.getAllAndOverride<boolean>(NO_PBAC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private getPbacChecksForHandler(context: ExecutionContext): AccessCheckDto[] {
    const request = context.switchToHttp().getRequest<Request>();
    const checkFns = this.reflector
      .getAll<AccessCheckFunc[]>(PBAC_KEY, [
        context.getHandler(),
        context.getClass(),
      ])
      .filter(Boolean);
    if (isEmpty(checkFns)) {
      this.logger.warn(`No pbac configured for route!`);
    }
    const checks = checkFns.reduce<AccessCheckDto[]>(
      (checks, func) => [...checks, ...zeroOrMore(func(request))],
      [DEFAULT_FEATURE_CHECK],
    );
    this.logger.verbose(`Configured access checks: ${jsonStringify(checks)}`);
    return checks;
  }

  private async evaluateChecksForHandler(
    context: ExecutionContext,
  ): Promise<AccessRequestResultDto> {
    try {
      return await lastValueFrom(
        this.identity.evaluatePbac(
          new AccessRequestDto(
            this.getPbacChecksForHandler(context),
            this.getPrincipalQuery(context),
          ),
        ),
      );
    } catch (err) {
      this.logger.error(
        `Error while evaluating access checks: ${getErrorMessage(err)}`,
      );
      this.logger.error(cleanAxiosError(err));
      throw new Errors.Unknown();
    }
  }

  private async performPbacChecksForHandler(
    context: ExecutionContext,
  ): Promise<boolean> {
    const accessCheckResult = await this.evaluateChecksForHandler(context);
    const request = context.switchToHttp().getRequest<RequestWithPrincipal>();
    request.principal = accessCheckResult.principal;
    if (!accessCheckResult.result) {
      const failedChecks = accessCheckResult.checks
        .filter((check) => !check.result)
        .map(({ action, resource }) => `${action} on ${resource}`)
        .join('; ');
      throw new Errors.FailedAccessCheck({ failedChecks });
    }

    return true;
  }

  private getPrincipalQuery(context: ExecutionContext): PrincipalQueryDto {
    const query =
      context.switchToHttp().getRequest<RequestWithUser>().user
        ?.principalQuery || new UnauthenticatedPrincipalQueryDto();
    this.logger.debug(`Principal query for request: ${jsonStringify(query)}`);

    return query;
  }
}
