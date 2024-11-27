import { createMock } from '@golevelup/ts-jest';
import { from, throwError } from 'rxjs';

import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as passport from '@nestjs/passport';

import {
  AgentLdapIdPrincipalQueryDto,
  IdentityMongoIdPrincipalQueryDto,
  PrincipalQueryDto,
  UnauthenticatedPrincipalQueryDto,
} from '../dto/principal-query.dto';
import { IdentityHttpService } from '../Http/Identity/identity-http.service';
import { AccessCheckDto } from '../dto/access-check.dto';
import { faker } from '../testing/data/fakers';
import { AccessRequestDto } from '../dto/access-request.dto';
import { AccessRequestResultDto } from '../dto/access-request-result.dto';
import Errors from '../Error';

import { IS_PUBLIC_KEY, NO_PBAC_KEY } from './constants';
import { AuthGuard, RequestWithUser } from './auth.guard';

jest.mock('@nestjs/passport', () => {
  const mocked = jest.fn();
  return {
    canActivate: mocked,
    AuthGuard: () =>
      class BaseGuard {
        canActivate() {
          return mocked();
        }
      },
  };
});

const isAuthenticated: jest.Mock<Promise<boolean>> = passport['canActivate'];

const createContext = (
  principalQuery: PrincipalQueryDto = new UnauthenticatedPrincipalQueryDto(),
) =>
  createMock<ExecutionContext>({
    getType: () => 'http',
    switchToHttp: () => ({
      getRequest: () =>
        createMock<RequestWithUser>({ user: { principalQuery } }),
    }),
  });
const createRpcContext = () =>
  createMock<ExecutionContext>({
    getType: () => 'rpc',
  });

describe('Auth guard', () => {
  const reflector = new Reflector();
  const identity = createMock<IdentityHttpService>();
  const guard = new AuthGuard(reflector, identity);
  const defaultCheck = AccessCheckDto.feature('ConsoleMicroservices');
  const checksWithDefault = [defaultCheck, faker(AccessCheckDto)];
  const identityMongoIdPrincipal = faker(IdentityMongoIdPrincipalQueryDto);
  const agentLdapIdPrincipal = faker(AgentLdapIdPrincipalQueryDto);

  const mockMetadata = (isPublic?: boolean, noPbac?: boolean) => {
    const metadata = {
      [NO_PBAC_KEY]: noPbac,
      [IS_PUBLIC_KEY]: isPublic,
    };
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockImplementation((key: string) => metadata[key]);
  };

  beforeEach(() => {
    jest.resetAllMocks();
    identity.evaluatePbac.mockReturnValue(
      from([faker(AccessRequestResultDto)]),
    );
  });

  describe('for public routes', () => {
    beforeEach(() => {
      mockMetadata(true);
    });

    it('allows access to unauthenticated users', async () => {
      expect.hasAssertions();

      isAuthenticated.mockRejectedValue(new Error('Unauthenticated'));
      expect(await guard.canActivate(createContext())).toBe(true);
    });

    it('allows access to authenticated users', async () => {
      expect.hasAssertions();

      isAuthenticated.mockResolvedValue(true);
      expect(
        await guard.canActivate(createContext(identityMongoIdPrincipal)),
      ).toBe(true);
    });

    it('allows access to authenticated agents', async () => {
      expect.hasAssertions();

      isAuthenticated.mockResolvedValue(true);
      expect(await guard.canActivate(createContext(agentLdapIdPrincipal))).toBe(
        true,
      );
    });

    it('allows non-http access', async () => {
      expect.hasAssertions();

      expect(await guard.canActivate(createRpcContext())).toBe(true);
    });
  });

  describe('for non-public routes', () => {
    beforeEach(() => {
      mockMetadata();
    });

    it('does not allow access to unauthenticated users', async () => {
      expect.hasAssertions();

      isAuthenticated.mockRejectedValue(new Error('Unauthenticated'));
      await expect(guard.canActivate(createContext())).rejects.toThrow(
        Errors.Unauthorized,
      );
    });

    it('allows access to authenticated users', async () => {
      expect.hasAssertions();

      isAuthenticated.mockResolvedValue(true);
      expect(
        await guard.canActivate(createContext(identityMongoIdPrincipal)),
      ).toBe(true);
    });

    it('allows access to authenticated agents', async () => {
      expect.hasAssertions();

      isAuthenticated.mockResolvedValue(true);
      expect(await guard.canActivate(createContext(agentLdapIdPrincipal))).toBe(
        true,
      );
    });

    it('allows non-http access', async () => {
      expect.hasAssertions();

      expect(await guard.canActivate(createRpcContext())).toBe(true);
    });
  });

  describe('with pbac', () => {
    beforeEach(() => {
      mockMetadata(true);
      jest
        .spyOn(reflector, 'getAll')
        .mockReturnValue([() => faker(AccessCheckDto)]);
    });

    it('runs pbac checks for unauthenticated users', async () => {
      expect.hasAssertions();

      isAuthenticated.mockRejectedValue(new Error('Unauthenticated'));
      expect(await guard.canActivate(createContext())).toBe(true);
      expect(identity.evaluatePbac).toBeCalledWith(
        faker(AccessRequestDto, {
          principalQuery: new UnauthenticatedPrincipalQueryDto(),
          checks: checksWithDefault,
        }),
      );
    });

    it('runs pbac checks for authenticated users', async () => {
      expect.hasAssertions();

      isAuthenticated.mockResolvedValue(true);
      expect(
        await guard.canActivate(createContext(identityMongoIdPrincipal)),
      ).toBe(true);
      expect(identity.evaluatePbac).toBeCalledWith(
        faker(AccessRequestDto, { checks: checksWithDefault }),
      );
    });

    it('runs pbac checks for authenticated agents', async () => {
      expect.hasAssertions();

      isAuthenticated.mockResolvedValue(true);
      expect(await guard.canActivate(createContext(agentLdapIdPrincipal))).toBe(
        true,
      );
      expect(identity.evaluatePbac).toBeCalledWith(
        faker(AccessRequestDto, {
          checks: checksWithDefault,
          principalQuery: agentLdapIdPrincipal,
        }),
      );
    });

    it('throws 403 if user fails access checks', async () => {
      expect.hasAssertions();

      isAuthenticated.mockResolvedValue(true);
      identity.evaluatePbac.mockReturnValue(
        from([faker(AccessRequestResultDto, { result: false })]),
      );
      await expect(
        guard.canActivate(createContext(identityMongoIdPrincipal)),
      ).rejects.toThrow(Errors.FailedAccessCheck);
      expect(identity.evaluatePbac).toBeCalledWith(
        faker(AccessRequestDto, { checks: checksWithDefault }),
      );
    });

    it('throws 500 if identity service cannot be reached', async () => {
      expect.hasAssertions();

      isAuthenticated.mockResolvedValue(true);
      identity.evaluatePbac.mockReturnValue(
        throwError(() => new Error('Computer says no')),
      );
      await expect(
        guard.canActivate(createContext(identityMongoIdPrincipal)),
      ).rejects.toThrow(Errors.Unknown);
    });
  });

  describe('without pbac specifically configured', () => {
    beforeEach(() => {
      mockMetadata(true);
      jest.spyOn(reflector, 'getAll').mockReturnValue([]);
      isAuthenticated.mockResolvedValue(true);
    });

    it('runs pbac checks for authenticated users including the default check', async () => {
      expect.hasAssertions();

      expect(
        await guard.canActivate(createContext(identityMongoIdPrincipal)),
      ).toBe(true);
      expect(identity.evaluatePbac).toBeCalledWith(
        faker(AccessRequestDto, { checks: [defaultCheck] }),
      );
    });

    it('runs pbac checks for authenticated agents including the default check', async () => {
      expect.hasAssertions();

      expect(await guard.canActivate(createContext(agentLdapIdPrincipal))).toBe(
        true,
      );
      expect(identity.evaluatePbac).toBeCalledWith(
        faker(AccessRequestDto, {
          checks: [defaultCheck],
          principalQuery: agentLdapIdPrincipal,
        }),
      );
    });
  });

  describe('with @NoPBAC', () => {
    beforeEach(() => {
      mockMetadata(false, true);
      jest.spyOn(reflector, 'getAll').mockReturnValue([]);
    });

    it('still requires authentication by default', async () => {
      expect.hasAssertions();

      isAuthenticated.mockRejectedValue(new Error('Unauthenticated'));
      await expect(guard.canActivate(createContext())).rejects.toThrow(
        Errors.Unauthorized,
      );
    });

    it('does not perform access checks for authenticated users', async () => {
      expect.hasAssertions();

      isAuthenticated.mockResolvedValue(true);
      expect(
        await guard.canActivate(createContext(identityMongoIdPrincipal)),
      ).toBe(true);
      expect(identity.evaluatePbac).not.toBeCalled();
    });

    it('does not perform access checks for authenticated agents', async () => {
      expect.hasAssertions();

      isAuthenticated.mockResolvedValue(true);
      expect(await guard.canActivate(createContext(agentLdapIdPrincipal))).toBe(
        true,
      );
      expect(identity.evaluatePbac).not.toBeCalled();
    });
  });

  describe('with @NoPBAC and @Public', () => {
    beforeEach(() => {
      mockMetadata(true, true);
      jest.spyOn(reflector, 'getAll').mockReturnValue([]);
    });

    it('does not perform access checks', async () => {
      expect.hasAssertions();

      isAuthenticated.mockRejectedValue(new Error('Unauthenticated'));
      expect(await guard.canActivate(createContext())).toBe(true);
      expect(identity.evaluatePbac).not.toBeCalled();
    });
  });
});
