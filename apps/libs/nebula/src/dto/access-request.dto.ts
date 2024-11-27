import { DTOFaker } from '../testing/data/fakers/decorators/Faker';
import { ReferencedBy } from '../ReferenceBuilder/decorators';
import { ExternalType } from '../utils/external-type';

import { AccessChecksDto } from './access-checks.dto';
import { AccessCheckDto } from './access-check.dto';
import { IsPrincipalQueryDto, PrincipalQueryDto } from './principal-query.dto';

@ExternalType()
@ReferencedBy<AccessRequestDto>(
  ({ principalQuery, checks }, ref) =>
    `principal query: ${ref(principalQuery)}; checks: ${ref(checks)}`,
)
@DTOFaker()
export class AccessRequestDto extends AccessChecksDto {
  /**
   * The query by which to find the principal to check the access of
   */
  @IsPrincipalQueryDto()
  readonly principalQuery: PrincipalQueryDto;

  constructor(checks: AccessCheckDto[], principalQuery: PrincipalQueryDto) {
    super(checks);
    this.principalQuery = principalQuery;
  }
}
