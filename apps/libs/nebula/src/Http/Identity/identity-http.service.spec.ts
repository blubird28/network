import nock from 'nock';
import { lastValueFrom } from 'rxjs';
import { toPlainObject } from 'lodash';

import { CompanyPublicDto } from '@libs/nebula/dto/identity/company-public.dto';
import { PaginatedRelationshipDefinitionDto } from '@libs/nebula/dto/identity/paginated-relationship-definition.dto';
import { ReadRelationshipDefinitionDto } from '@libs/nebula/dto/identity/read-relationship-definition.dto';
import { CreateRelationshipDefinitionDto } from '@libs/nebula/dto/identity/create-relationship-definition.dto';
import { RelationshipDefinitionVerbDto } from '@libs/nebula/dto/identity/relationship-definition-verb.dto';
import { UpdateRelationshipDefinitionDto } from '@libs/nebula/dto/identity/update-relationship-definition.dto';
import { CreateRelationshipDto } from '@libs/nebula/dto/identity/create-relationship.dto';
import { RelationshipDefinition } from '@libs/nebula/entities/identity/relationship-definition.entity';
import { RelationshipDto } from '@libs/nebula/dto/identity/relationship.dto';
import { PaginatedRelationshipDto } from '@libs/nebula/dto/identity/paginated-relationship.dto';
import { RelationshipIdDto } from '@libs/nebula/dto/identity/relationship-id.dto';
import { EntityIdDto } from '@libs/nebula/dto/identity/entity-id.dto';

import { AccessRequestResultDto } from '../../dto/access-request-result.dto';
import { PaginatedUserDetailDto } from '../../dto/identity/paginated-user-detail.dto';
import { UserDetailDto } from '../../dto/identity/user-detail.dto';
import { AccessRequestDto } from '../../dto/access-request.dto';
import { AccessCheckDto } from '../../dto/access-check.dto';
import { CompanyIdDto } from '../../dto/company-id.dto';
import { faker } from '../../testing/data/fakers';
import { HeartbeatResponseDto } from '../../Heartbeat/interfaces/dto/heartbeat-response.dto';
import { PaginationDto } from '../../dto/pagination.dto';
import { pathJoin } from '../../utils/data/pathJoin';
import {
  REST_BY_USER_ID_PATH,
  REST_BY_MONGO_ID_PATH,
  REST_BY_USERNAME_PATH,
  REST_USER_PUBLIC_PREFIX,
  REST_PBAC_PREFIX,
  REST_PBAC_EVALUATE_REQUEST_PATH,
  REST_PBAC_USERS_WITH_ACCESS_PATH,
  REST_BY_COMPANY_ID_PATH,
  REST_DETAIL_PATH,
  REST_COMPANY_PUBLIC_PREFIX,
  REST_RELATIONSHIP_DEFINITION_PREFIX,
  REST_BY_RELATIONSHIP_DEFINIION_VERB_PATH,
  REST_RELATIONSHIP_PREFIX,
  REST_BY_RELATIONSHIP_ID_PATH,
  REST_BY_RELATIONSHIP_SUBJECT_ENTITY_ID_PATH,
  REST_BY_RELATIONSHIP_OBJECT_ENTITY_ID_PATH,
} from '../../Identity/identity.constants';
import { PaginatedUserPublicDto } from '../../dto/identity/paginated-user-public.dto';
import { UserIdDto } from '../../dto/user-id.dto';
import { UserPublicDto } from '../../dto/identity/user-public.dto';
import { urlTemplate } from '../utils/urlTemplate';
import { MongoIdDto } from '../../dto/mongo-id.dto';
import { UsernameDto } from '../../dto/username.dto';
import { MockerBuilder } from '../../testing/mocker/mocker.builder';
import toPlain from '../../utils/data/toPlain';

import { IdentityHttpService } from './identity-http.service';

describe('IdentityHttpService', () => {
  let service: IdentityHttpService;
  let scope: nock.Scope;
  const apiUrl = 'https://test-api.url';

  beforeEach(async () => {
    service = new IdentityHttpService(
      MockerBuilder.mockConfigService({
        IDENTITY_SERVICE_URL: apiUrl,
      }),
    );
    scope = nock(apiUrl).matchHeader(
      'user-agent',
      'constellation-identity-http-service',
    );
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('configures the client appropriately', async () => {
    scope.get('/test').reply(200, 'OK');

    const result = await lastValueFrom(service.get('/test'));

    expect(result.status).toBe(200);
    expect(result.data).toBe('OK');
    expect(scope.isDone()).toBe(true);
  });

  it('gets client heartbeat', async () => {
    scope.get('/heartbeat').reply(200, faker(HeartbeatResponseDto));

    const result = await lastValueFrom(service.getClientHeartbeat());

    expect(result).toStrictEqual(faker(HeartbeatResponseDto));
    expect(scope.isDone()).toBe(true);
  });

  it('lists public users', async () => {
    scope
      .get(pathJoin(REST_USER_PUBLIC_PREFIX))
      .query({ ...faker(PaginationDto) })
      .reply(200, faker(PaginatedUserPublicDto));

    const result = await lastValueFrom(
      service.listUserPublic(faker(PaginationDto)),
    );

    expect(result).toStrictEqual(faker(PaginatedUserPublicDto));
    expect(scope.isDone()).toBe(true);
  });

  it('gets public user info by id', async () => {
    scope
      .get(
        urlTemplate(
          pathJoin(REST_USER_PUBLIC_PREFIX, REST_BY_USER_ID_PATH),
          faker(UserIdDto),
        ),
      )
      .reply(200, faker(UserPublicDto));

    const result = await lastValueFrom(
      service.getUserPublicById(faker(UserIdDto)),
    );

    expect(result).toStrictEqual(faker(UserPublicDto));
    expect(scope.isDone()).toBe(true);
  });

  it('gets public user info by mongo id', async () => {
    scope
      .get(
        urlTemplate(
          pathJoin(REST_USER_PUBLIC_PREFIX, REST_BY_MONGO_ID_PATH),
          faker(MongoIdDto),
        ),
      )
      .reply(200, faker(UserPublicDto));

    const result = await lastValueFrom(
      service.getUserPublicByMongoId(faker(MongoIdDto)),
    );

    expect(result).toStrictEqual(faker(UserPublicDto));
    expect(scope.isDone()).toBe(true);
  });

  it('gets public user info by username', async () => {
    scope
      .get(
        urlTemplate(
          pathJoin(REST_USER_PUBLIC_PREFIX, REST_BY_USERNAME_PATH),
          faker(UsernameDto),
        ),
      )
      .reply(200, faker(UserPublicDto));

    const result = await lastValueFrom(
      service.getUserPublicByUsername(faker(UsernameDto)),
    );

    expect(result).toStrictEqual(faker(UserPublicDto));
    expect(scope.isDone()).toBe(true);
  });

  it('gets public user detail info by username', async () => {
    scope
      .get(
        urlTemplate(
          pathJoin(
            REST_USER_PUBLIC_PREFIX,
            REST_BY_USERNAME_PATH,
            REST_DETAIL_PATH,
          ),
          faker(UsernameDto),
        ),
      )
      .reply(200, faker(UserDetailDto));

    const result = await lastValueFrom(
      service.getUserDetailByUsername(faker(UsernameDto)),
    );

    expect(result).toStrictEqual(faker(UserDetailDto));
    expect(scope.isDone()).toBe(true);
  });

  it('evaluates a pbac request', async () => {
    const accessRequest = faker(AccessRequestDto);
    const response = faker(AccessRequestResultDto);
    scope
      .post(
        pathJoin(REST_PBAC_PREFIX, REST_PBAC_EVALUATE_REQUEST_PATH),
        (body) => {
          expect(body).toStrictEqual(toPlain(accessRequest));
          return true;
        },
      )
      .reply(200, response);

    const result = await lastValueFrom(service.evaluatePbac(accessRequest));

    expect(result).toStrictEqual(response);
    expect(scope.isDone()).toBe(true);
  });

  it('gets public company info by mongo id', async () => {
    scope
      .get(
        urlTemplate(
          pathJoin(REST_COMPANY_PUBLIC_PREFIX, REST_BY_MONGO_ID_PATH),
          faker(MongoIdDto),
        ),
      )
      .reply(200, faker(CompanyPublicDto));

    const result = await lastValueFrom(
      service.getCompanyPublicByMongoId(faker(MongoIdDto)),
    );

    expect(result).toStrictEqual(faker(CompanyPublicDto));
    expect(scope.isDone()).toBe(true);
  });

  it('gets public company info by username', async () => {
    scope
      .get(
        urlTemplate(
          pathJoin(REST_COMPANY_PUBLIC_PREFIX, REST_BY_USERNAME_PATH),
          faker(UsernameDto),
        ),
      )
      .reply(200, faker(CompanyPublicDto));

    const result = await lastValueFrom(
      service.getCompanyPublicByUsername(faker(UsernameDto)),
    );

    expect(result).toStrictEqual(faker(CompanyPublicDto));
    expect(scope.isDone()).toBe(true);
  });

  describe('gets users with access in company', () => {
    const accessRequest = faker(AccessCheckDto);
    const paginationPage1 = faker(PaginationDto, { skip: 0, count: 100 });
    const resultsPage1 = Array.from({ length: 101 }, () =>
      faker(UserDetailDto),
    );
    const responsePage1 = faker(PaginatedUserDetailDto, {
      skip: 0,
      count: 100,
      total: 101,
      results: resultsPage1,
    });
    const paginationPage2 = faker(PaginationDto, { skip: 100, count: 100 });
    const resultsPage2 = [faker(UserDetailDto)];
    const responsePage2 = faker(PaginatedUserDetailDto, {
      skip: 100,
      count: 10,
      total: 101,
      results: resultsPage2,
    });
    const byCompanyIdUrl = urlTemplate(
      pathJoin(
        REST_PBAC_PREFIX,
        REST_BY_COMPANY_ID_PATH,
        REST_PBAC_USERS_WITH_ACCESS_PATH,
      ),
      faker(CompanyIdDto),
    );
    const byMongoIdUrl = urlTemplate(
      pathJoin(
        REST_PBAC_PREFIX,
        REST_BY_MONGO_ID_PATH,
        REST_PBAC_USERS_WITH_ACCESS_PATH,
      ),
      faker(MongoIdDto),
    );

    it('gets a page of users given a company id and access request', async () => {
      scope
        .get(byCompanyIdUrl)
        .query({ ...accessRequest, ...paginationPage1 })
        .reply(200, responsePage1);

      const result = await lastValueFrom(
        service.getUsersWithAccessByCompanyId(
          faker(CompanyIdDto),
          accessRequest,
          paginationPage1,
        ),
      );

      expect(result).toStrictEqual(responsePage1);
      expect(scope.isDone()).toBe(true);
    });

    it('gets a page of users given a mongo id and access request', async () => {
      scope
        .get(byMongoIdUrl)
        .query({ ...accessRequest, ...paginationPage1 })
        .reply(200, responsePage1);

      const result = await lastValueFrom(
        service.getUsersWithAccessByCompanyMongoId(
          faker(MongoIdDto),
          accessRequest,
          paginationPage1,
        ),
      );

      expect(result).toStrictEqual(responsePage1);
      expect(scope.isDone()).toBe(true);
    });

    it('gets all users given a company id and access request', async () => {
      scope
        .get(byCompanyIdUrl)
        .query({ ...accessRequest, ...paginationPage1 })
        .reply(200, responsePage1);
      scope
        .get(byCompanyIdUrl)
        .query({ ...accessRequest, ...paginationPage2 })
        .reply(200, responsePage2);

      const result = await lastValueFrom(
        service.getAllUsersWithAccessByCompanyId(
          faker(CompanyIdDto),
          accessRequest,
        ),
      );

      expect(result).toStrictEqual([...resultsPage1, ...resultsPage2]);
      expect(scope.isDone()).toBe(true);
    });

    it('gets all users given a mongo id and access request', async () => {
      scope
        .get(byMongoIdUrl)
        .query({ ...accessRequest, ...paginationPage1 })
        .reply(200, responsePage1);
      scope
        .get(byMongoIdUrl)
        .query({ ...accessRequest, ...paginationPage2 })
        .reply(200, responsePage2);

      const result = await lastValueFrom(
        service.getAllUsersWithAccessByCompanyMongoId(
          faker(MongoIdDto),
          accessRequest,
        ),
      );

      expect(result).toStrictEqual([...resultsPage1, ...resultsPage2]);
      expect(scope.isDone()).toBe(true);
    });
  });

  describe('relationship definitions', () => {
    it('posts a relationship definition', async () => {
      const fakeCreateRelationshipDefinition = faker(
        CreateRelationshipDefinitionDto,
        { roleIds: [] },
      );
      scope
        .post(pathJoin(REST_RELATIONSHIP_DEFINITION_PREFIX), {
          subjectType: fakeCreateRelationshipDefinition.subjectType,
          objectType: fakeCreateRelationshipDefinition.objectType,
          verb: fakeCreateRelationshipDefinition.verb,
          name: fakeCreateRelationshipDefinition.name,
          roleIds: fakeCreateRelationshipDefinition.roleIds,
        })
        .reply(200, faker(ReadRelationshipDefinitionDto));

      const result = await lastValueFrom(
        service.createRelationshipDefinition(fakeCreateRelationshipDefinition),
      );

      expect(result).toStrictEqual(faker(ReadRelationshipDefinitionDto));
      expect(scope.isDone()).toBe(true);
    });

    it('gets all relationship definitions', async () => {
      scope
        .get(pathJoin(REST_RELATIONSHIP_DEFINITION_PREFIX))
        .query({ ...faker(PaginationDto) })
        .reply(200, faker(PaginatedRelationshipDefinitionDto));

      const result = await lastValueFrom(
        service.listRelationshipDefinitions(faker(PaginationDto)),
      );

      expect(result).toStrictEqual(faker(PaginatedRelationshipDefinitionDto));
      expect(scope.isDone()).toBe(true);
    });

    it('gets one relationship definition by verb', async () => {
      scope
        .get(
          urlTemplate(
            pathJoin(
              REST_RELATIONSHIP_DEFINITION_PREFIX,
              REST_BY_RELATIONSHIP_DEFINIION_VERB_PATH,
            ),
            faker(RelationshipDefinitionVerbDto),
          ),
        )
        .reply(200, faker(ReadRelationshipDefinitionDto));

      const result = await lastValueFrom(
        service.getRelationshipDefinitionByVerb(
          faker(RelationshipDefinitionVerbDto),
        ),
      );

      expect(result).toStrictEqual(faker(ReadRelationshipDefinitionDto));
      expect(scope.isDone()).toBe(true);
    });

    it('patches a relationship definition', async () => {
      const fakeUpdateRelationshipDefinition = faker(
        UpdateRelationshipDefinitionDto,
        { roleIds: [] },
      );
      scope
        .patch(
          urlTemplate(
            pathJoin(
              REST_RELATIONSHIP_DEFINITION_PREFIX,
              REST_BY_RELATIONSHIP_DEFINIION_VERB_PATH,
            ),
            faker(RelationshipDefinitionVerbDto),
          ),
          {
            subjectType: fakeUpdateRelationshipDefinition.subjectType,
            objectType: fakeUpdateRelationshipDefinition.objectType,
            verb: fakeUpdateRelationshipDefinition.verb,
            name: fakeUpdateRelationshipDefinition.name,
            roleIds: fakeUpdateRelationshipDefinition.roleIds,
          },
        )
        .reply(200, faker(ReadRelationshipDefinitionDto));

      const result = await lastValueFrom(
        service.updateRelationshipDefinitionByVerb(
          faker(RelationshipDefinitionVerbDto),
          fakeUpdateRelationshipDefinition,
        ),
      );

      expect(result).toStrictEqual(faker(ReadRelationshipDefinitionDto));
      expect(scope.isDone()).toBe(true);
    });

    it('deletes a relationship definition', async () => {
      scope
        .delete(
          urlTemplate(
            pathJoin(
              REST_RELATIONSHIP_DEFINITION_PREFIX,
              REST_BY_RELATIONSHIP_DEFINIION_VERB_PATH,
            ),
            faker(RelationshipDefinitionVerbDto),
          ),
        )
        .reply(200);

      await lastValueFrom(
        service.deleteRelationshipDefinitionByVerb(
          faker(RelationshipDefinitionVerbDto),
        ),
      );

      expect(scope.isDone()).toBe(true);
    });
  });

  describe('relationships', () => {
    it('posts a relationship', async () => {
      const fakeCreateRelationshipDto = faker(CreateRelationshipDto);
      scope
        .post(pathJoin(REST_RELATIONSHIP_PREFIX), {
          subject: fakeCreateRelationshipDto.subject,
          object: fakeCreateRelationshipDto.object,
          relationshipDefinition:
            fakeCreateRelationshipDto.relationshipDefinition,
        })
        .reply(200, faker(RelationshipDto));

      const result = await lastValueFrom(
        service.findOrCreateRelationship(fakeCreateRelationshipDto),
      );

      expect(result).toStrictEqual(faker(RelationshipDto));
      expect(scope.isDone()).toBe(true);
    });

    it('gets all relationships', async () => {
      scope
        .get(pathJoin(REST_RELATIONSHIP_PREFIX))
        .query({ ...faker(PaginationDto) })
        .reply(200, faker(PaginatedRelationshipDto));

      const result = await lastValueFrom(
        service.listRelationships(faker(PaginationDto)),
      );

      expect(result).toStrictEqual(faker(PaginatedRelationshipDto));
      expect(scope.isDone()).toBe(true);
    });

    it('gets one relationship by id', async () => {
      scope
        .get(
          urlTemplate(
            pathJoin(REST_RELATIONSHIP_PREFIX, REST_BY_RELATIONSHIP_ID_PATH),
            faker(RelationshipIdDto),
          ),
        )
        .reply(200, faker(RelationshipDto));

      const result = await lastValueFrom(
        service.getRelationshipById(faker(RelationshipIdDto)),
      );

      expect(result).toStrictEqual(faker(RelationshipDto));
      expect(scope.isDone()).toBe(true);
    });

    it('gets relationships by subject entity id', async () => {
      scope
        .get(
          urlTemplate(
            pathJoin(
              REST_RELATIONSHIP_PREFIX,
              REST_BY_RELATIONSHIP_SUBJECT_ENTITY_ID_PATH,
            ),
            faker(EntityIdDto),
          ),
        )
        .query({ ...faker(PaginationDto) })
        .reply(200, faker(PaginatedRelationshipDto));

      const result = await lastValueFrom(
        service.getRelationshipsBySubjectEntityId(
          faker(PaginationDto),
          faker(EntityIdDto),
        ),
      );

      expect(result).toStrictEqual(faker(PaginatedRelationshipDto));
      expect(scope.isDone()).toBe(true);
    });

    it('gets relationships by object entity id', async () => {
      scope
        .get(
          urlTemplate(
            pathJoin(
              REST_RELATIONSHIP_PREFIX,
              REST_BY_RELATIONSHIP_OBJECT_ENTITY_ID_PATH,
            ),
            faker(EntityIdDto),
          ),
        )
        .query({ ...faker(PaginationDto) })
        .reply(200, faker(PaginatedRelationshipDto));

      const result = await lastValueFrom(
        service.getRelationshipsByObjectEntityId(
          faker(PaginationDto),
          faker(EntityIdDto),
        ),
      );

      expect(result).toStrictEqual(faker(PaginatedRelationshipDto));
      expect(scope.isDone()).toBe(true);
    });

    it('deletes a relationship', async () => {
      scope
        .delete(
          urlTemplate(
            pathJoin(REST_RELATIONSHIP_PREFIX, REST_BY_RELATIONSHIP_ID_PATH),
            faker(RelationshipIdDto),
          ),
        )
        .reply(200);

      await lastValueFrom(
        service.deleteRelationshipById(faker(RelationshipIdDto)),
      );

      expect(scope.isDone()).toBe(true);
    });
  });
});
