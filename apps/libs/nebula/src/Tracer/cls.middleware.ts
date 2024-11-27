import { ClsMiddleware } from 'nestjs-cls';

import { TracerInformationFactory } from '@libs/nebula/Tracer/tracer-information.factory';
import { TRACER_CLS_KEY } from '@libs/nebula/Tracer/constants';

export class TracerClsMiddleware extends ClsMiddleware {
  constructor() {
    super({
      setup: (cls, req) => {
        cls.set(TRACER_CLS_KEY, TracerInformationFactory.buildFromRequest(req));
      },
    });
  }
}
