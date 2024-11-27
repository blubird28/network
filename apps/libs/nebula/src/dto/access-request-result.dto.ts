import { Type } from 'class-transformer';

import { DTOFaker } from '../testing/data/fakers/decorators/Faker';
import { ReferencedBy } from '../ReferenceBuilder/decorators';
import { DeepFake, DeepFakeMany } from '../testing/data/fakers';
import { ExternalType } from '../utils/external-type';

import ArrayProp from './decorators/ArrayProp.decorator';
import Prop from './decorators/Prop.decorator';
import { PrincipalDto } from './identity/principal.dto';
import { AccessCheckResultDto } from './access-check-result.dto';
import BooleanProp from './decorators/BooleanProp.decorator';

@ExternalType()
@ReferencedBy<AccessRequestResultDto>(
  ({ principal, checks, result }, ref) =>
    `principal: ${principal?.user?.mongoId || 'none'}; result: ${
      result ? 'ALLOW' : 'DENY'
    }; checks: ${ref(checks)}`,
)
@DTOFaker()
export class AccessRequestResultDto {
  /**
   * The principal the access check was performed against
   */
  @Prop()
  @DeepFake(() => PrincipalDto)
  @Type(() => PrincipalDto)
  public readonly principal: PrincipalDto;

  /**
   * The checks and their results
   */
  @DeepFakeMany(() => AccessCheckResultDto, {})
  @ArrayProp()
  @Type(() => AccessCheckResultDto)
  public readonly checks: AccessCheckResultDto[];

  /**
   * The result of the access request (true if all checks are true)
   * @example true
   */
  @BooleanProp({ fake: true })
  readonly result: boolean;

  constructor(results: AccessCheckResultDto[], principal: PrincipalDto) {
    this.principal = principal;
    this.checks = results;
    this.result = results?.every(({ result }) => result) || false;
  }
}
