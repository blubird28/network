import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import { ExternalType } from '@libs/nebula/utils/external-type';
import { FAKE_TOKEN } from '@libs/nebula/testing/data/constants';

import StringProp from '../decorators/StringProp.decorator';

@ExternalType()
@DTOFaker()
export class BPHppTokenResponseDto {
  @StringProp({
    allowEmpty: false,
    fake: FAKE_TOKEN,
  })
  accessToken: string;
}
