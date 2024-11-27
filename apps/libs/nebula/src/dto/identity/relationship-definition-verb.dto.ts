import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import { ExternalType } from '@libs/nebula/utils/external-type';

import StringProp from '../decorators/StringProp.decorator';

@ExternalType()
@DTOFaker()
export class RelationshipDefinitionVerbDto {
  /**
   * The the relationship definition verb to look up. Should make sense when spoken aloud between subject and object.
   * For eg, TimCo _refers_ PaddyCo
   * Tim _isAdminFor_ TimCo
   * @example isServiceAdminFor
   */
  @StringProp({ allowEmpty: false, fake: 'isServiceAdminFor' })
  readonly verb: string;
}
