import { Expose, Type } from 'class-transformer';
import { IsNotEmptyObject, ValidateNested } from 'class-validator';
import { DiscriminatorDescriptor } from 'class-transformer/types/interfaces/decorator-options/type-discriminator-descriptor.interface';

import { applyDecorators, Type as Constructor } from '@nestjs/common';

import { ExternalType } from '../utils/external-type';
import { DTOFaker } from '../testing/data/fakers/decorators/Faker';
import { ReferencedBy, ReferencedEmpty } from '../ReferenceBuilder/decorators';
import Errors from '../Error';
import { JOE_BLOGGS_USERNAME } from '../testing/data/constants';
import { createFakerDecorator, faker } from '../testing/data/fakers';

import StringProp, { MongoIDProp } from './decorators/StringProp.decorator';

export enum PrincipalQueryType {
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  IDENTITY_ID = 'IDENTITY_ID',
  AGENT_LDAP_ID = 'AGENT_LDAP_ID',
}

export abstract class PrincipalQuery {
  readonly type: PrincipalQueryType;

  protected constructor(type: PrincipalQueryType) {
    this.type = type;
  }
}

@ExternalType()
@DTOFaker()
@ReferencedBy<IdentityMongoIdPrincipalQueryDto>(
  ({ identityId }) => `identityId: ${identityId}`,
)
export class IdentityMongoIdPrincipalQueryDto extends PrincipalQuery {
  @StringProp({ fake: PrincipalQueryType.IDENTITY_ID })
  readonly type: PrincipalQueryType.IDENTITY_ID;

  @MongoIDProp({ error: Errors.InvalidMongoId })
  readonly identityId: string;

  constructor(identityId: string) {
    super(PrincipalQueryType.IDENTITY_ID);
    this.identityId = identityId;
  }
}

@ExternalType()
@DTOFaker()
@ReferencedBy<AgentLdapIdPrincipalQueryDto>(({ ldapId }) => `ldapId: ${ldapId}`)
export class AgentLdapIdPrincipalQueryDto extends PrincipalQuery {
  @StringProp({ fake: PrincipalQueryType.AGENT_LDAP_ID })
  readonly type: PrincipalQueryType.AGENT_LDAP_ID;

  @StringProp({ fake: JOE_BLOGGS_USERNAME, allowEmpty: false })
  readonly ldapId: string;

  constructor(ldapId: string) {
    super(PrincipalQueryType.AGENT_LDAP_ID);
    this.ldapId = ldapId;
  }
}

@ExternalType()
@DTOFaker()
@ReferencedEmpty()
export class UnauthenticatedPrincipalQueryDto extends PrincipalQuery {
  @StringProp({ fake: PrincipalQueryType.UNAUTHENTICATED })
  readonly type: PrincipalQueryType.UNAUTHENTICATED;

  constructor() {
    super(PrincipalQueryType.UNAUTHENTICATED);
  }
}

export type PrincipalQueryDto =
  | IdentityMongoIdPrincipalQueryDto
  | AgentLdapIdPrincipalQueryDto
  | UnauthenticatedPrincipalQueryDto;

const TYPE_NAME_TO_CONSTRUCTOR: Readonly<
  Record<PrincipalQueryType, Constructor<PrincipalQueryDto>>
> = Object.freeze({
  [PrincipalQueryType.IDENTITY_ID]: IdentityMongoIdPrincipalQueryDto,
  [PrincipalQueryType.AGENT_LDAP_ID]: AgentLdapIdPrincipalQueryDto,
  [PrincipalQueryType.UNAUTHENTICATED]: UnauthenticatedPrincipalQueryDto,
});

const discriminator: DiscriminatorDescriptor = {
  property: 'type',
  subTypes: Object.entries(TYPE_NAME_TO_CONSTRUCTOR).map(([name, value]) => ({
    name,
    value,
  })),
};

export const FakePrincipalQueryDto = () =>
  createFakerDecorator<PrincipalQuery>((override) => {
    const type =
      TYPE_NAME_TO_CONSTRUCTOR[override?.type] ??
      IdentityMongoIdPrincipalQueryDto;
    return override instanceof type ? override : faker(type, override);
  });

export const IsPrincipalQueryDto = () =>
  applyDecorators(
    Type(() => PrincipalQuery, {
      keepDiscriminatorProperty: true,
      discriminator,
    }),
    ValidateNested(),
    IsNotEmptyObject(),
    FakePrincipalQueryDto(),
    Expose(),
  );
