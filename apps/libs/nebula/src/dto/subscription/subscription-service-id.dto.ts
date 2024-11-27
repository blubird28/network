import { MaxLength } from 'class-validator';

import Errors from '@libs/nebula/Error';
import { MAX_LENGTH_10 } from '@libs/nebula/subscription/subscription.constants';
import { FAKE_OBJECT_ID } from '@libs/nebula/testing/data/constants';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';
import StringProp from '../decorators/StringProp.decorator';

@ExternalType()
@DTOFaker()
export class SubscriptionServiceIdDto {
  @StringProp({
    allowEmpty: false,
    fake: FAKE_OBJECT_ID,
    error: Errors.InvalidServiceId,
  })
  @MaxLength(MAX_LENGTH_10, { context: Errors.InvalidServiceId.context })
  readonly serviceId: string;
}
