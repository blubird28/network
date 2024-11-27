import HttpStatusCodes from 'http-status-codes';

import { ErrorKey } from '../constants';

export const PricingErrorParams = new Map<ErrorKey, number>([
  ['InvalidPriceRequestId', HttpStatusCodes.BAD_REQUEST],
  ['CannotCompileSchema', HttpStatusCodes.BAD_REQUEST],
  ['InvalidUserPriceRequestAttributes', HttpStatusCodes.BAD_REQUEST],
  ['InvalidPriceId', HttpStatusCodes.BAD_REQUEST],
  ['CheckpointNotFound', HttpStatusCodes.NOT_FOUND],
  ['PriceRequestNotFound', HttpStatusCodes.NOT_FOUND],
  ['CheckpointNotFound', HttpStatusCodes.NOT_FOUND],
  ['PriceNotFound', HttpStatusCodes.NOT_FOUND],
  ['NoPriceAvailable', HttpStatusCodes.NOT_FOUND],
  ['PriceRequestExists', HttpStatusCodes.CONFLICT],
  ['PriceEnrichHandlerInvalid', HttpStatusCodes.BAD_REQUEST],
]);
