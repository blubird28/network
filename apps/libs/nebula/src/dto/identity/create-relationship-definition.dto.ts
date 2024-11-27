import { IntersectionType } from '@nestjs/swagger';

import { IntersectionFaker } from '@libs/nebula/testing/data/fakers';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';

import { RoleIdsDto } from './role-ids.dto';
import { RelationshipDefinitionVerbDto } from './relationship-definition-verb.dto';
import { RelationshipDefinitionBaseDto } from './relationship-definition-base.dto';

@ExternalType()
@DTOFaker()
@IntersectionFaker(
  RelationshipDefinitionBaseDto,
  RelationshipDefinitionVerbDto,
  RoleIdsDto,
)
export class CreateRelationshipDefinitionDto extends IntersectionType(
  RelationshipDefinitionBaseDto,
  RelationshipDefinitionVerbDto,
  RoleIdsDto,
) {}
