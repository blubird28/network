import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import { ExternalType } from '@libs/nebula/utils/external-type';
import { JOE_BLOGGS_USERNAME } from '@libs/nebula/testing/data/constants';

import StringProp, { UUIDv4Prop } from '../decorators/StringProp.decorator';

@ExternalType()
@DTOFaker()
export class EntityDto {
  /**
   * The entity's (identity's) username (used in some legacy URLs)
   * @example joe_bloggs
   */
  @StringProp({ allowEmpty: false, fake: JOE_BLOGGS_USERNAME })
  readonly username: string;

  /**
   * The (identity) entity ID
   * @example 96711b0a-abfd-456b-b928-6e2ea29a87ac
   */
  @UUIDv4Prop()
  readonly id: string;
}
