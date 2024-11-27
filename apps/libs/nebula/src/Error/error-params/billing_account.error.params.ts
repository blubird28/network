import HttpStatusCodes from 'http-status-codes';

import { ErrorKey } from '../constants';

export const BillingAccountErrorParams = new Map<ErrorKey, number>([
  ['NoBillingAccountCreated', HttpStatusCodes.INTERNAL_SERVER_ERROR],
  ['InvalidBillingCompanyId', HttpStatusCodes.BAD_REQUEST],
  ['InvalidCustomerId', HttpStatusCodes.BAD_REQUEST],
  ['NoBillingAccountFound', HttpStatusCodes.NOT_FOUND],
  ['NoBillingAccountFoundShield', HttpStatusCodes.NOT_FOUND],
  ['NoBillingAccountFoundBP', HttpStatusCodes.NOT_FOUND],
  ['BillingAccountFailedShield', HttpStatusCodes.INTERNAL_SERVER_ERROR],
  ['BillingAccountFailedBP', HttpStatusCodes.INTERNAL_SERVER_ERROR],
  ['InvalidBillingAccount', HttpStatusCodes.UNPROCESSABLE_ENTITY],
  ['ShieldAPITimeout', HttpStatusCodes.GATEWAY_TIMEOUT],
  ['BpAPITimeout', HttpStatusCodes.GATEWAY_TIMEOUT],
  ['InvalidCRMIds', HttpStatusCodes.UNPROCESSABLE_ENTITY],
  ['BillingEntityFound', HttpStatusCodes.BAD_REQUEST],
  ['NoBillingEntityCreated', HttpStatusCodes.INTERNAL_SERVER_ERROR],
  ['BillingEntityNotFound', HttpStatusCodes.NOT_FOUND],
  ['BillingAccountAssociatedWithBillingEntity', HttpStatusCodes.BAD_REQUEST],
  ['NoBillingEntityUpdated', HttpStatusCodes.INTERNAL_SERVER_ERROR],
  ['NoBillingEntityDeleted', HttpStatusCodes.INTERNAL_SERVER_ERROR],
  ['BillingAccountUpdateFailed', HttpStatusCodes.INTERNAL_SERVER_ERROR],
  ['SyncBillingAccountFailed', HttpStatusCodes.INTERNAL_SERVER_ERROR],
  ['NoValidBillingAccountFound', HttpStatusCodes.INTERNAL_SERVER_ERROR],
  ['InvalidRequestBody', HttpStatusCodes.BAD_REQUEST],
  ['BpDeleteCardFailed', HttpStatusCodes.INTERNAL_SERVER_ERROR],
  ['BpCardNotFound', HttpStatusCodes.NOT_FOUND],
]);
