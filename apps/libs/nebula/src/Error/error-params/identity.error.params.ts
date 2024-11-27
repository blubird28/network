import HttpStatusCodes from 'http-status-codes';

import { ErrorKey } from '../constants';

export const IdentityErrorParams = new Map<ErrorKey, number>([
  ['InvalidCompanyId', HttpStatusCodes.BAD_REQUEST],
  ['InvalidEmail', HttpStatusCodes.BAD_REQUEST],
  ['InvalidMongoId', HttpStatusCodes.BAD_REQUEST],
  ['InvalidUserId', HttpStatusCodes.BAD_REQUEST],
  ['InvalidEntityId', HttpStatusCodes.BAD_REQUEST],
  ['InvalidRelationshipId', HttpStatusCodes.BAD_REQUEST],
  ['InvalidUsername', HttpStatusCodes.BAD_REQUEST],
  ['InvalidPagination', HttpStatusCodes.BAD_REQUEST],
  ['InvalidRelationshipDefinitionVerb', HttpStatusCodes.BAD_REQUEST],
  ['InvalidEntityType', HttpStatusCodes.BAD_REQUEST],
  ['UnsupportedDataSyncQuery', HttpStatusCodes.BAD_REQUEST],
  ['UserNotFound', HttpStatusCodes.NOT_FOUND],
  ['CompanyNotFound', HttpStatusCodes.NOT_FOUND],
  ['RelationshipDefinitionNotFound', HttpStatusCodes.NOT_FOUND],
  ['RelationshipDefinitionAlreadyExists', HttpStatusCodes.CONFLICT],
  ['RelationshipNotFound', HttpStatusCodes.NOT_FOUND],
  ['ProfileNotFound', HttpStatusCodes.NOT_FOUND],
  ['EmailExists', HttpStatusCodes.CONFLICT],
  ['ProfileExists', HttpStatusCodes.CONFLICT],
]);
