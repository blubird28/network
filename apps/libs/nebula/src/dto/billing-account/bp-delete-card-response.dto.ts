import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import { ExternalType } from '@libs/nebula/utils/external-type';
import { FAKE_UUID } from '@libs/nebula/testing/data/constants';

import StringProp from '../decorators/StringProp.decorator';

@ExternalType()
@DTOFaker()
export class BPDeleteCardResponseDto {
  @StringProp({
    allowEmpty: true,
    fake: 'Success',
  })
  message: string;

  @StringProp({
    allowEmpty: true,
    fake: FAKE_UUID,
  })
  cardId: string;
}
