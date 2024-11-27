import { FAKE_ASN } from '@libs/nebula/testing/data/constants';

import { UUIDv4Prop } from '../decorators/StringProp.decorator';
import NumberProp from '../decorators/NumberProp.decorator';

export class AllocatePrivateASNResponseDto {
  @UUIDv4Prop()
  resourceId: string;

  @NumberProp({ fake: FAKE_ASN, optional: false })
  asn: number;
}
