import { FAKE_INSIGHT_REQUEST } from '@libs/nebula/testing/data/constants';

import { UUIDv4Prop } from '../decorators/StringProp.decorator';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';

@ExternalType()
@DTOFaker()
export class InsightDetailsResponseDto {
  @UUIDv4Prop({
    fake: FAKE_INSIGHT_REQUEST.id,
    allowEmpty: false,
  })
  readonly id: string;
  constructor(id) {
    this.id = id;
  }
}
