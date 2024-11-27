import { Type } from 'class-transformer';

import { DTOFaker } from '../testing/data/fakers/decorators/Faker';
import { ReferencedBy } from '../ReferenceBuilder/decorators';
import { DeepFakeMany } from '../testing/data/fakers';
import { ExternalType } from '../utils/external-type';

import ArrayProp from './decorators/ArrayProp.decorator';
import { AccessCheckDto } from './access-check.dto';

@ExternalType()
@ReferencedBy<AccessChecksDto>(({ checks }, ref) => `checks: ${ref(checks)}`)
@DTOFaker()
export class AccessChecksDto {
  /**
   * The access checks to perform
   */
  @DeepFakeMany(() => AccessCheckDto, {})
  @ArrayProp()
  @Type(() => AccessCheckDto)
  public readonly checks: AccessCheckDto[];

  constructor(checks: AccessCheckDto[]) {
    this.checks = checks;
  }
}
