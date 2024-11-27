/**
 * Injection Tokens
 */
export const IDENTITY_SERVICE_TOKEN = Symbol.for('IDENTITY_SERVICE_TOKEN');

/**
 * REST url tokens
 */
export const REST_ADMIN_PREFIX = 'admin';
export const REST_USER_PUBLIC_PREFIX = 'user-public';
export const REST_USER_PROFILE_PREFIX = 'user-profile';
export const REST_PBAC_PREFIX = 'pbac';
export const REST_COMPANY_PUBLIC_PREFIX = 'company-public';
export const REST_RELATIONSHIP_PREFIX = 'relationship';
export const REST_RELATIONSHIP_DEFINITION_PREFIX = 'relationship-definition';
export const REST_BY_USER_ID_PATH = 'by-id/:userId';
export const REST_BY_MONGO_ID_PATH = 'by-mongo-id/:mongoId';
export const REST_BY_USERNAME_PATH = 'by-username/:username';
export const REST_BY_COMPANY_ID_PATH = 'by-id/:companyId';
export const REST_BY_RELATIONSHIP_DEFINIION_VERB_PATH = 'by-verb/:verb';
export const REST_BY_RELATIONSHIP_ID_PATH = 'by-id/:relationshipId';
export const REST_BY_RELATIONSHIP_SUBJECT_ENTITY_ID_PATH =
  'by-subject-entity-id/:entityId';
export const REST_BY_RELATIONSHIP_OBJECT_ENTITY_ID_PATH =
  'by-object-entity-id/:entityId';
export const REST_PBAC_EVALUATE_REQUEST_PATH = 'evaluate-request';
export const REST_PBAC_USERS_WITH_ACCESS_PATH = 'users-with-access';

export const REST_DETAIL_PATH = 'detail';

export const MESSAGE_PATTERN_MIGRATE_ONE_USER_BY_EMAIL = {
  cmd: 'migrateOneUserByEmail',
};
export const MESSAGE_PATTERN_USER_UPDATED = {
  eventType: 'USER_UPDATED',
};
export const MESSAGE_PATTERN_USER_CREATED = {
  eventType: 'USER_CREATED',
};
export const MESSAGE_PATTERN_COMPANY_UPDATED = {
  eventType: 'COMPANY_UPDATED',
};
export const MESSAGE_PATTERN_COMPANY_CREATED = {
  eventType: 'COMPANY_CREATED',
};
export const MESSAGE_PATTERN_ROLE_UPDATED = {
  eventType: 'ROLE_UPDATED',
};
export const MESSAGE_PATTERN_ROLE_CREATED = {
  eventType: 'ROLE_CREATED',
};
export const MESSAGE_PATTERN_POLICY_UPDATED = {
  eventType: 'POLICY_UPDATED',
};
export const MESSAGE_PATTERN_POLICY_CREATED = {
  eventType: 'POLICY_CREATED',
};
export const MESSAGE_PATTERN_LINKUSERCOMPANY_UPDATED = {
  eventType: 'LINKUSERCOMPANY_UPDATED',
};
export const MESSAGE_PATTERN_LINKUSERCOMPANY_CREATED = {
  eventType: 'LINKUSERCOMPANY_CREATED',
};
export const MESSAGE_PATTERN_AGENT_UPDATED = {
  eventType: 'AGENT_UPDATED',
};
export const MESSAGE_PATTERN_AGENT_CREATED = {
  eventType: 'AGENT_CREATED',
};
export const MESSAGE_PATTERN_MIGRATE_ONE_USER_BY_MONGO_ID = {
  cmd: 'migrateOneUserByMongoId',
};
export const MESSAGE_PATTERN_MIGRATE_ONE_USER_BY_USERNAME = {
  cmd: 'migrateOneUserByUsername',
};
export const MESSAGE_PATTERN_MIGRATE_ALL_USERS = {
  cmd: 'migrateAllUsers',
};
export const MESSAGE_PATTERN_MIGRATE_ONE_POLICY_BY_MONGO_ID = {
  cmd: 'migrateOnePolicyByMongoId',
};
export const MESSAGE_PATTERN_MIGRATE_ALL_POLICIES = {
  cmd: 'migrateAllPolicies',
};
export const MESSAGE_PATTERN_MIGRATE_ONE_ROLE_BY_MONGO_ID = {
  cmd: 'migrateOneRoleByMongoId',
};
export const MESSAGE_PATTERN_MIGRATE_ALL_ROLES = {
  cmd: 'migrateAllRoles',
};
export const MESSAGE_PATTERN_MIGRATE_ONE_COMPANY_BY_MONGO_ID = {
  cmd: 'migrateOneCompanyByMongoId',
};
export const MESSAGE_PATTERN_MIGRATE_ALL_COMPANIES = {
  cmd: 'migrateAllCompanies',
};
export const MESSAGE_PATTERN_MIGRATE_USER_COMPANY_LINKS_BY_MONGO_ID = {
  cmd: 'migrateUserCompanyLinksByMongoId',
};

export const MESSAGE_PATTERN_MIGRATE_ALL_USER_COMPANY_LINKS = {
  cmd: 'migrateAllUserCompanyLinks',
};

export const MESSAGE_PATTERN_MIGRATE_AGENTS_BY_MONGO_ID = {
  cmd: 'migrateAgentsByMongoId',
};

export const MESSAGE_PATTERN_MIGRATE_ALL_AGENTS = {
  cmd: 'migrateAllAgents',
};
