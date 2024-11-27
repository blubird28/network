import { PartialType } from '@nestjs/swagger';

import { IntersectionFaker } from '@libs/nebula/testing/data/fakers';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';

import { CreateRelationshipDefinitionDto } from './create-relationship-definition.dto';

@ExternalType()
@DTOFaker()
@IntersectionFaker(CreateRelationshipDefinitionDto)
export class UpdateRelationshipDefinitionDto extends PartialType(
  CreateRelationshipDefinitionDto,
) {}
