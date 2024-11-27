import { DTOFaker } from '../testing/data/fakers/decorators/Faker';
import { ReferencedBy } from '../ReferenceBuilder/decorators';
import { ExternalType } from '../utils/external-type';

import { AccessCheckDto } from './access-check.dto';
import BooleanProp from './decorators/BooleanProp.decorator';

@ExternalType()
@ReferencedBy<AccessCheckResultDto>(
  ({ resource, action, result }) =>
    `action: ${action}; resource: ${resource}; result: ${
      result ? 'ALLOW' : 'DENY'
    }`,
)
@DTOFaker()
export class AccessCheckResultDto extends AccessCheckDto {
  /**
   * The result of the access check
   * @example true
   */
  @BooleanProp({ fake: true })
  readonly result: boolean;

  constructor(check: AccessCheckDto, result: boolean) {
    super(check?.action, check?.resource);
    this.result = result;
  }
}
