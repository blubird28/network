import Axios, { AxiosRequestConfig } from 'axios';
import { mergeAll, Observable, toArray } from 'rxjs';
import qs from 'qs';

import { HttpService } from '@nestjs/axios';
import { Inject, Logger, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CompanyPublicDto } from '@libs/nebula/dto/identity/company-public.dto';
import { PaginatedRelationshipDefinitionDto } from '@libs/nebula/dto/identity/paginated-relationship-definition.dto';
import { CreateRelationshipDefinitionDto } from '@libs/nebula/dto/identity/create-relationship-definition.dto';
import { ReadRelationshipDefinitionDto } from '@libs/nebula/dto/identity/read-relationship-definition.dto';
import { RelationshipDefinitionVerbDto } from '@libs/nebula/dto/identity/relationship-definition-verb.dto';
import { UpdateRelationshipDefinitionDto } from '@libs/nebula/dto/identity/update-relationship-definition.dto';
import { CreateRelationshipDto } from '@libs/nebula/dto/identity/create-relationship.dto';
import { RelationshipDto } from '@libs/nebula/dto/identity/relationship.dto';
import { PaginatedRelationshipDto } from '@libs/nebula/dto/identity/paginated-relationship.dto';
import { RelationshipIdDto } from '@libs/nebula/dto/identity/relationship-id.dto';
import { EntityIdDto } from '@libs/nebula/dto/identity/entity-id.dto';
import { SharedErrorInterceptor } from '@libs/nebula/Http/interceptors/shared-error.interceptor';
import { serializeNoContent } from '@libs/nebula/Http/utils/serializeNoContent';

import { AccessRequestDto } from '../../dto/access-request.dto';
import { AccessCheckDto } from '../../dto/access-check.dto';
import { CompanyIdDto } from '../../dto/company-id.dto';
import { constellationPageGetter, pager } from '../utils/pager';
import { projectPageResults } from '../utils/projectPageResults';
import { pathJoin } from '../../utils/data/pathJoin';
import { serializeResponse } from '../utils/serializeResponse';
import { AttachTracerInterceptor } from '../interceptors/attach-tracer.interceptor';
import { PaginatedUserPublicDto } from '../../dto/identity/paginated-user-public.dto';
import { UserPublicDto } from '../../dto/identity/user-public.dto';
import { UserIdDto } from '../../dto/user-id.dto';
import { MongoIdDto } from '../../dto/mongo-id.dto';
import { PaginationDto } from '../../dto/pagination.dto';
import { urlTemplate } from '../utils/urlTemplate';
import {
  REST_BY_USER_ID_PATH,
  REST_BY_MONGO_ID_PATH,
  REST_BY_USERNAME_PATH,
  REST_USER_PUBLIC_PREFIX,
  REST_PBAC_EVALUATE_REQUEST_PATH,
  REST_PBAC_PREFIX,
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
import {
  PingableClient,
  PingableClientInterface,
} from '../../Ping/ping.decorators';
import { HeartbeatResponseDto } from '../../Heartbeat/interfaces/dto/heartbeat-response.dto';
import { ThrottleInterceptor } from '../interceptors/throttle.interceptor';
import { AxiosLoggerInterceptor } from '../interceptors/axios-logger.interceptor';
import { IdentityServiceConfig } from '../../Config/schemas/identity-service.schema';
import { BaseConfig } from '../../Config/schemas/base.schema';
import { UsernameDto } from '../../dto/username.dto';
import { PaginatedUserDetailDto } from '../../dto/identity/paginated-user-detail.dto';
import { UserDetailDto } from '../../dto/identity/user-detail.dto';
import { AccessRequestResultDto } from '../../dto/access-request-result.dto';

type RequiredConfig = BaseConfig & IdentityServiceConfig;

@PingableClient('IDENTITY_SERVICE')
export class IdentityHttpService
  extends HttpService
  implements OnApplicationShutdown, PingableClientInterface
{
  private readonly logger: Logger = new Logger(IdentityHttpService.name);
  private readonly throttle = new ThrottleInterceptor();
  private readonly axiosLogger = new AxiosLoggerInterceptor(this.logger);
  private readonly attachTracer = new AttachTracerInterceptor(this.logger);
  private readonly sharedErrorInterceptor = new SharedErrorInterceptor();

  constructor(
    @Inject(ConfigService) configService: ConfigService<RequiredConfig, true>,
  ) {
    super(
      Axios.create({
        baseURL: configService.get('IDENTITY_SERVICE_URL'),
        headers: {
          'user-agent': 'constellation-identity-http-service',
        },
        paramsSerializer: {
          serialize: (val) => qs.stringify(val),
        },
      }),
    );

    this.throttle.attach(this.axiosRef);
    this.axiosLogger.attach(this.axiosRef);
    this.attachTracer.attach(this.axiosRef);
    this.sharedErrorInterceptor.attach(this.axiosRef);
  }

  onApplicationShutdown() {
    this.throttle.cleanup();
  }

  getClientHeartbeat(): Observable<HeartbeatResponseDto> {
    return this.get<HeartbeatResponseDto>('/heartbeat').pipe(
      serializeResponse(HeartbeatResponseDto),
    );
  }

  listUserPublic(params: PaginationDto) {
    return this.get(pathJoin(REST_USER_PUBLIC_PREFIX), { params }).pipe(
      serializeResponse(PaginatedUserPublicDto),
    );
  }

  getUserPublicById(userIdDto: UserIdDto) {
    return this.get(
      urlTemplate(
        pathJoin(REST_USER_PUBLIC_PREFIX, REST_BY_USER_ID_PATH),
        userIdDto,
      ),
    ).pipe(serializeResponse(UserPublicDto));
  }

  getUserPublicByMongoId(mongoIdDto: MongoIdDto) {
    return this.get(
      urlTemplate(
        pathJoin(REST_USER_PUBLIC_PREFIX, REST_BY_MONGO_ID_PATH),
        mongoIdDto,
      ),
    ).pipe(serializeResponse(UserPublicDto));
  }

  getUserPublicByUsername(usernameDto: UsernameDto) {
    return this.get(
      urlTemplate(
        pathJoin(REST_USER_PUBLIC_PREFIX, REST_BY_USERNAME_PATH),
        usernameDto,
      ),
    ).pipe(serializeResponse(UserPublicDto));
  }

  getUserDetailByUsername(usernameDto: UsernameDto) {
    return this.get(
      urlTemplate(
        pathJoin(
          REST_USER_PUBLIC_PREFIX,
          REST_BY_USERNAME_PATH,
          REST_DETAIL_PATH,
        ),
        usernameDto,
      ),
    ).pipe(serializeResponse(UserDetailDto));
  }

  evaluatePbac(accessRequest: AccessRequestDto) {
    return this.post(
      pathJoin(REST_PBAC_PREFIX, REST_PBAC_EVALUATE_REQUEST_PATH),
      accessRequest,
    ).pipe(serializeResponse(AccessRequestResultDto));
  }

  getUsersWithAccessByCompanyMongoId(
    companyMongoId: MongoIdDto,
    accessRequest: AccessCheckDto,
    pagination: PaginationDto = new PaginationDto(),
  ) {
    const { url, params } = this.getUsersWithAccessByCompanyMongoIdConfig(
      companyMongoId,
      accessRequest,
      pagination,
    );
    return this.get(url, { params }).pipe(
      serializeResponse(PaginatedUserDetailDto),
    );
  }

  getUsersWithAccessByCompanyId(
    companyId: CompanyIdDto,
    accessRequest: AccessCheckDto,
    pagination: PaginationDto = new PaginationDto(),
  ) {
    const { url, params } = this.getUsersWithAccessByCompanyIdConfig(
      companyId,
      accessRequest,
      pagination,
    );
    return this.get(url, { params }).pipe(
      serializeResponse(PaginatedUserDetailDto),
    );
  }

  getAllUsersWithAccessByCompanyMongoId(
    companyMongoId: MongoIdDto,
    accessRequest: AccessCheckDto,
  ) {
    return pager(
      this,
      constellationPageGetter(
        this.getUsersWithAccessByCompanyMongoIdConfig(
          companyMongoId,
          accessRequest,
        ),
      ),
    ).pipe(
      serializeResponse(UserDetailDto, projectPageResults),
      mergeAll(),
      toArray(),
    );
  }

  getAllUsersWithAccessByCompanyId(
    companyId: CompanyIdDto,
    accessRequest: AccessCheckDto,
  ) {
    return pager(
      this,
      constellationPageGetter(
        this.getUsersWithAccessByCompanyIdConfig(companyId, accessRequest),
      ),
    ).pipe(
      serializeResponse(UserDetailDto, projectPageResults),
      mergeAll(),
      toArray(),
    );
  }

  private getUsersWithAccessByCompanyMongoIdConfig(
    companyMongoId: MongoIdDto,
    accessRequest: AccessCheckDto,
    pagination: PaginationDto = new PaginationDto(),
  ): AxiosRequestConfig {
    return {
      method: 'GET',
      url: urlTemplate(
        pathJoin(
          REST_PBAC_PREFIX,
          REST_BY_MONGO_ID_PATH,
          REST_PBAC_USERS_WITH_ACCESS_PATH,
        ),
        companyMongoId,
      ),
      params: {
        ...accessRequest,
        ...pagination,
      },
    };
  }

  private getUsersWithAccessByCompanyIdConfig(
    companyId: CompanyIdDto,
    accessRequest: AccessCheckDto,
    pagination: PaginationDto = new PaginationDto(),
  ): AxiosRequestConfig {
    return {
      method: 'GET',
      url: urlTemplate(
        pathJoin(
          REST_PBAC_PREFIX,
          REST_BY_COMPANY_ID_PATH,
          REST_PBAC_USERS_WITH_ACCESS_PATH,
        ),
        companyId,
      ),
      params: {
        ...accessRequest,
        ...pagination,
      },
    };
  }

  getCompanyPublicByMongoId(mongoIdDto: MongoIdDto) {
    return this.get(
      urlTemplate(
        pathJoin(REST_COMPANY_PUBLIC_PREFIX, REST_BY_MONGO_ID_PATH),
        mongoIdDto,
      ),
    ).pipe(serializeResponse(CompanyPublicDto));
  }

  getCompanyPublicByUsername(usernameDto: UsernameDto) {
    return this.get(
      urlTemplate(
        pathJoin(REST_COMPANY_PUBLIC_PREFIX, REST_BY_USERNAME_PATH),
        usernameDto,
      ),
    ).pipe(serializeResponse(CompanyPublicDto));
  }

  createRelationshipDefinition(
    createRelationshipDefinitionDto: CreateRelationshipDefinitionDto,
  ) {
    return this.post(
      pathJoin(REST_RELATIONSHIP_DEFINITION_PREFIX),
      createRelationshipDefinitionDto,
    ).pipe(serializeResponse(ReadRelationshipDefinitionDto));
  }

  listRelationshipDefinitions(params: PaginationDto) {
    return this.get(pathJoin(REST_RELATIONSHIP_DEFINITION_PREFIX), {
      params,
    }).pipe(serializeResponse(PaginatedRelationshipDefinitionDto));
  }

  getRelationshipDefinitionByVerb(
    relationshipDefinitionVerbDto: RelationshipDefinitionVerbDto,
  ) {
    return this.get(
      urlTemplate(
        pathJoin(
          REST_RELATIONSHIP_DEFINITION_PREFIX,
          REST_BY_RELATIONSHIP_DEFINIION_VERB_PATH,
        ),
        relationshipDefinitionVerbDto,
      ),
    ).pipe(serializeResponse(ReadRelationshipDefinitionDto));
  }

  updateRelationshipDefinitionByVerb(
    relationshipDefinitionVerbDto: RelationshipDefinitionVerbDto,
    updateRelationshipDefinitionDto: UpdateRelationshipDefinitionDto,
  ) {
    return this.patch(
      urlTemplate(
        pathJoin(
          REST_RELATIONSHIP_DEFINITION_PREFIX,
          REST_BY_RELATIONSHIP_DEFINIION_VERB_PATH,
        ),
        relationshipDefinitionVerbDto,
      ),
      updateRelationshipDefinitionDto,
    ).pipe(serializeResponse(ReadRelationshipDefinitionDto));
  }

  deleteRelationshipDefinitionByVerb(
    relationshipDefinitionVerbDto: RelationshipDefinitionVerbDto,
  ): Observable<void> {
    return this.delete(
      urlTemplate(
        pathJoin(
          REST_RELATIONSHIP_DEFINITION_PREFIX,
          REST_BY_RELATIONSHIP_DEFINIION_VERB_PATH,
        ),
        relationshipDefinitionVerbDto,
      ),
    ).pipe(serializeNoContent());
  }

  findOrCreateRelationship(createRelationshipDto: CreateRelationshipDto) {
    return this.post(
      pathJoin(REST_RELATIONSHIP_PREFIX),
      createRelationshipDto,
    ).pipe(serializeResponse(RelationshipDto));
  }

  listRelationships(params: PaginationDto) {
    return this.get(pathJoin(REST_RELATIONSHIP_PREFIX), {
      params,
    }).pipe(serializeResponse(PaginatedRelationshipDto));
  }

  getRelationshipById(relationshipIdDto: RelationshipIdDto) {
    return this.get(
      urlTemplate(
        pathJoin(REST_RELATIONSHIP_PREFIX, REST_BY_RELATIONSHIP_ID_PATH),
        relationshipIdDto,
      ),
    ).pipe(serializeResponse(RelationshipDto));
  }

  getRelationshipsBySubjectEntityId(
    params: PaginationDto,
    entityId: EntityIdDto,
  ) {
    return this.get(
      urlTemplate(
        pathJoin(
          REST_RELATIONSHIP_PREFIX,
          REST_BY_RELATIONSHIP_SUBJECT_ENTITY_ID_PATH,
        ),
        entityId,
      ),
      { params },
    ).pipe(serializeResponse(PaginatedRelationshipDto));
  }

  getRelationshipsByObjectEntityId(
    params: PaginationDto,
    entityId: EntityIdDto,
  ) {
    return this.get(
      urlTemplate(
        pathJoin(
          REST_RELATIONSHIP_PREFIX,
          REST_BY_RELATIONSHIP_OBJECT_ENTITY_ID_PATH,
        ),
        entityId,
      ),
      { params },
    ).pipe(serializeResponse(PaginatedRelationshipDto));
  }

  deleteRelationshipById(
    relationshipIdDto: RelationshipIdDto,
  ): Observable<void> {
    return this.delete(
      urlTemplate(
        pathJoin(REST_RELATIONSHIP_PREFIX, REST_BY_RELATIONSHIP_ID_PATH),
        relationshipIdDto,
      ),
    ).pipe(serializeNoContent());
  }
}
