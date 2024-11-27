import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { DeepFake } from '@libs/nebula/testing/data/fakers';

import { ExternalType } from '../../utils/external-type';
import { UUIDv4Prop } from '../decorators/StringProp.decorator';

import { ReadRelationshipDefinitionDto } from './read-relationship-definition.dto';
import { EntityDto } from './entity.dto';

@ExternalType()
export class RelationshipDto {
  /**
   * The ID of the relationship instance
   * @example 96711b0a-abfd-456b-b928-6e2ea29a87ac
   */
  @UUIDv4Prop()
  id: string;

  @Expose()
  @DeepFake(() => EntityDto)
  @Type(() => EntityDto)
  @ValidateNested()
  subject: EntityDto;

  @Expose()
  @DeepFake(() => EntityDto)
  @Type(() => EntityDto)
  @ValidateNested()
  object: EntityDto;

  @Expose()
  @DeepFake(() => ReadRelationshipDefinitionDto)
  @Type(() => ReadRelationshipDefinitionDto)
  @ValidateNested()
  relationshipDefinition: ReadRelationshipDefinitionDto;
}
