import { applyDecorators, SetMetadata } from '@nestjs/common';

import { NO_PBAC_KEY } from './constants';

export const NoPBAC = () => applyDecorators(SetMetadata(NO_PBAC_KEY, true));
