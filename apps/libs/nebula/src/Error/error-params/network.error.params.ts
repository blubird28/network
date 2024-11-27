import HttpStatusCodes from 'http-status-codes';

import { ErrorKey } from '../constants';

export const NetworkErrorParams = new Map<ErrorKey, number>([
  ['NoSuitableIpBlocks', HttpStatusCodes.NOT_FOUND],
  ['UsageOverCapabilityLimit', HttpStatusCodes.BAD_REQUEST],
  ['InvalidLinknetSize', HttpStatusCodes.BAD_REQUEST],
  ['UnmatchedASSet', HttpStatusCodes.CONFLICT],
  ['UnmatchedASN', HttpStatusCodes.CONFLICT],
  ['InvalidASNFormat', HttpStatusCodes.BAD_REQUEST],
  ['CannotSyncASNNotReferenced', HttpStatusCodes.NOT_FOUND],
  ['CannotSyncPrivateASN', HttpStatusCodes.BAD_REQUEST],
  ['NoUsableASNs', HttpStatusCodes.INTERNAL_SERVER_ERROR],
  ['InvalidValidationConfig', HttpStatusCodes.INTERNAL_SERVER_ERROR],
  ['InvalidAsnRequestedForAllocation', HttpStatusCodes.BAD_REQUEST],
  ['UsagesExistForResource', HttpStatusCodes.CONFLICT],
  ['CannotDeallocatePublicASN', HttpStatusCodes.CONFLICT],
  ['DuplicatePrivateASN', HttpStatusCodes.CONFLICT],
  ['ResourceIsBeingUsed', HttpStatusCodes.CONFLICT],
  ['ASNNotFound', HttpStatusCodes.NOT_FOUND],
]);
