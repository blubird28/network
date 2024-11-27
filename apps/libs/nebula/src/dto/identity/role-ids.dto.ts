import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import { ExternalType } from '@libs/nebula/utils/external-type';
import { IsV4UUID } from '@libs/nebula/utils/decorators/isV4UUID.decorator';

import { StringArrayProp } from '../decorators/ArrayProp.decorator';

@ExternalType()
@DTOFaker()
export class RoleIdsDto {
  /**
   * The role IDs to include
   * @example ["96711b0a-abfd-456b-b928-6e2ea29a87ac"]
   */
  @StringArrayProp({ fake: [] }, IsV4UUID({ each: true }))
  readonly roleIds: string[] = [];
}
