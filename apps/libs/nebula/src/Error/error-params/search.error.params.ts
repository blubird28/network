import HttpStatusCodes from 'http-status-codes';

import { ErrorKey } from '../constants';

export const SearchErrorParams = new Map<ErrorKey, number>([
  ['DomainNotFound', HttpStatusCodes.NOT_FOUND],
  ['ZeroDomains', HttpStatusCodes.BAD_REQUEST],
  ['InvalidParameter', HttpStatusCodes.BAD_REQUEST],
  ['InvalidParameterValue', HttpStatusCodes.BAD_REQUEST],
]);
