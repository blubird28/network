import { FAKE_UUID } from '@libs/nebula/testing/data/constants';
import Errors from '@libs/nebula/Error';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';
import { UUIDv4Prop } from '../decorators/StringProp.decorator';

@ExternalType()
@DTOFaker()
export class OrderIdDto {
  @UUIDv4Prop({
    fake: FAKE_UUID,
    allowEmpty: false,
    error: Errors.InvalidOrderId,
  })
  readonly orderId: string;
}
