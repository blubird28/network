import Errors from '@libs/nebula/Error';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';
import StringProp, { UUIDv4Prop } from '../decorators/StringProp.decorator';

@ExternalType()
@DTOFaker()
export class CreateRelationshipDto {
  /**
   * The ID of the subject entity
   * @example 96711b0a-abfd-456b-b928-6e2ea29a87ac
   */

  @UUIDv4Prop({ error: Errors.InvalidEntityId })
  readonly subject: string;

  /**
   * The ID of the object entity
   * @example 96711b0a-abfd-456b-b928-6e2ea29a87ac
   */

  @UUIDv4Prop({ error: Errors.InvalidEntityId })
  readonly object: string;

  /**
   * The the relationship being set between the entities
   * @example resellsTo
   */
  @StringProp({ allowEmpty: false, fake: 'isServiceAdminFor' })
  readonly relationshipDefinition: string;
}
