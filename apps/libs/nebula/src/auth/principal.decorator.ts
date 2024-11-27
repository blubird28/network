import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { RequestWithPrincipal } from './auth.guard';

export const Principal = createParamDecorator(
  (ignored: never, ctx: ExecutionContext) =>
    ctx.switchToHttp().getRequest<RequestWithPrincipal>().principal,
);
