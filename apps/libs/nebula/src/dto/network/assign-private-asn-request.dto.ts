import { FAKE_ASN } from '@libs/nebula/testing/data/constants';

import BooleanProp from '../decorators/BooleanProp.decorator';
import { MongoIDProp } from '../decorators/StringProp.decorator';
import NumberProp from '../decorators/NumberProp.decorator';

export class AllocatePrivateASNRequestDto {
  @NumberProp({ fake: FAKE_ASN, optional: true })
  asn?: number;

  @MongoIDProp()
  companyId: string;

  @BooleanProp({ fake: false, optional: false })
  autoAssign: boolean;
}
