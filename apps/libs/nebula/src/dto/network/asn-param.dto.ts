import { IsInt, IsPositive } from 'class-validator';

import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import NumberProp from '@libs/nebula/dto/decorators/NumberProp.decorator';
import { FAKE_ASN } from '@libs/nebula/testing/data/constants';

@DTOFaker()
export class ASNParamDto {
  /**
   * The ASN (Autonomous System Number) to act upon, not including the AS prefix.
   * @example 3491
   */
  @NumberProp(
    { allowInfinity: false, allowNaN: false, fake: FAKE_ASN },
    IsPositive,
    IsInt,
  )
  asn: number;
}
