import Errors from '@libs/nebula/Error';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import { ExternalType } from '@libs/nebula/utils/external-type';

import { UUIDv4Prop } from '../decorators/StringProp.decorator';

@ExternalType()
@DTOFaker()
export class EntityIdDto {
  /**
   * The (identity) entity ID to look up
   * @example 96711b0a-abfd-456b-b928-6e2ea29a87ac
   */
  @UUIDv4Prop({ error: Errors.InvalidEntityId })
  readonly entityId: string;
}
