import { createMock } from '@golevelup/ts-jest';

import { ExecutionContext } from '@nestjs/common';

import { PrincipalDto } from '../dto/identity/principal.dto';
import { faker } from '../testing/data/fakers';
import { getParamDecoratorFactory } from '../testing/utils/getParamDecoratorFactory';

import { RequestWithPrincipal } from './auth.guard';
import { Principal } from './principal.decorator';

describe('@Principal decorator', () => {
  const principal = faker(PrincipalDto);
  const request = createMock<RequestWithPrincipal>({ principal });
  const context = createMock<ExecutionContext>({
    getType: () => 'http',
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  });

  it('provides the principal from the request to the param', () => {
    expect.hasAssertions();
    expect(getParamDecoratorFactory(Principal)(null, context)).toStrictEqual(
      principal,
    );
  });
});
