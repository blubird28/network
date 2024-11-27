import { FAKE_UUID } from '@libs/nebula/testing/data/constants';

import { UUIDProp } from '../decorators/StringProp.decorator';

export class GetPublicASNRequestDto {
  @UUIDProp({ fake: FAKE_UUID })
  asnId: string;
}
