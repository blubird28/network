import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';

import { UUIDv4Prop } from '../decorators/StringProp.decorator';

@DTOFaker()
export class ResourceIdDto {
  /**
   * The resource ID
   */
  @UUIDv4Prop()
  id: string;
}
