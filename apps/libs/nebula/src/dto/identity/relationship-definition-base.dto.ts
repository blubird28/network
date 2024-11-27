import { MaxLength } from 'class-validator';
import { Expose, Type } from 'class-transformer';

import { IdentityType } from '@libs/nebula/entities/identity/identity.entity';
import { DEFAULT_MAX_STRING_LENGTH } from '@libs/nebula/Config/config.constants';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { Fake } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';
@ExternalType()
@DTOFaker()
export class RelationshipDefinitionBaseDto {
  /**
   * The type of entity that is expected/allowed on the subject end of the relationship
   * @example 'USER'
   */
  @Fake('USER')
  @Expose()
  @MaxLength(DEFAULT_MAX_STRING_LENGTH)
  @Type(() => String)
  readonly subjectType: IdentityType;

  /**
   * The type of entity that is expected/allowed on the object end of the relationship
   * @example 'COMPANY'
   */
  @Fake('COMPANY')
  @Expose()
  @MaxLength(DEFAULT_MAX_STRING_LENGTH)
  @Type(() => String)
  readonly objectType: IdentityType;

  /**
   * The human-friendly name of the relationship being defined
   * @example 'Service Admin'
   */
  @Fake('Service Admin')
  @Expose()
  @MaxLength(DEFAULT_MAX_STRING_LENGTH)
  @Type(() => String)
  readonly name: string;
}
