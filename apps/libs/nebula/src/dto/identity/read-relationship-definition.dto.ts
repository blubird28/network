import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { DeepFakeMany } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';

import { RoleDto } from './role.dto';
import { RelationshipDefinitionDto } from './relationship-definition.dto';

@ExternalType()
export class ReadRelationshipDefinitionDto extends RelationshipDefinitionDto {
  @Expose()
  @Type(() => RoleDto)
  @DeepFakeMany(() => RoleDto)
  @ValidateNested()
  roles: RoleDto[] = [];
}
