import { IntersectionType } from '@nestjs/swagger';

import { IntersectionFaker } from '@libs/nebula/testing/data/fakers';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';

import { RelationshipDefinitionBaseDto } from './relationship-definition-base.dto';
import { RelationshipDefinitionVerbDto } from './relationship-definition-verb.dto';

@ExternalType()
@DTOFaker()
@IntersectionFaker(RelationshipDefinitionBaseDto, RelationshipDefinitionVerbDto)
export class RelationshipDefinitionDto extends IntersectionType(
  RelationshipDefinitionBaseDto,
  RelationshipDefinitionVerbDto,
) {}
