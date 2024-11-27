import {
  FAKE_RATING_METHOD,
  FAKE_RATE,
} from '@libs/nebula/testing/data/constants';

import StringProp from '../decorators/StringProp.decorator';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';

@ExternalType()
@DTOFaker()
export class SubscriptionRatingDetailDto {
  @StringProp({
    allowEmpty: false,
    fake: FAKE_RATE,
  })
  readonly rate: string;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_RATING_METHOD,
  })
  readonly ratingMethod: string;
}
