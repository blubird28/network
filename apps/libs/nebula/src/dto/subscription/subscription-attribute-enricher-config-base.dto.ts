import { Validate } from 'class-validator';
import { Expose, Type } from 'class-transformer';

import StringProp from '../decorators/StringProp.decorator';
import { ExternalType } from '../../utils/external-type';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { Fake } from '../../testing/data/fakers';
import { SerializedDataDto, ValidSerializedData } from '../serialized-data.dto';
import { SerializedData } from '../../Serialization/serializes';
import Errors from '../../Error';

@ExternalType()
@DTOFaker()
export class SubscriptionAttributeEnricherConfigBaseDto {
  /**
   * The property which this enricher will create. Should be unique per price request
   * @example location
   */
  @StringProp({ allowEmpty: false, fake: 'destLocation' })
  readonly key: string;

  /**
   * The handler for this enricher. The handler must be defined in the subscription enricher service.
   * @example GET_DCF_DETAILS_BY_ID
   */
  @StringProp({ allowEmpty: false, fake: 'GET_DCF_DETAILS_BY_ID' })
  readonly handler: string;

  /**
   * A template which will be resolved and passed as arguments to the handler.
   * @example <%= location.dcfId %>
   */
  @Expose()
  @Type(() => SerializedDataDto)
  @Fake(['<%= order.attributes.destinationPortId %>'])
  @Validate(ValidSerializedData, { context: Errors.InvalidTemplate.context })
  paramTemplate: SerializedData;
}
