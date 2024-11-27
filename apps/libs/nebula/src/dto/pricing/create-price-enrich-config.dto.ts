import { Validate } from 'class-validator';
import { Expose, Type } from 'class-transformer';

import { FAKE_UUID } from '@libs/nebula/testing/data/constants';

import StringProp from '../decorators/StringProp.decorator';
import { ExternalType } from '../../utils/external-type';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { Fake } from '../../testing/data/fakers';
import { SerializedDataDto, ValidSerializedData } from '../serialized-data.dto';
import { SerializedData } from '../../Serialization/serializes';
import Errors from '../../Error';

@ExternalType()
@DTOFaker()
export class CreatePriceEnrichConfigDto {
  /**
   * The property which this enricher will create. Should be unique per price request
   * @example costbookLocation
   */
  @StringProp({ allowEmpty: false, fake: 'costbookLocation' })
  readonly key: string;
  /**
   * The priceKey to match for. Required. this enrichment will only run for requests with a matching priceKey
   * @example widget_price_final
   */
  @StringProp({ allowEmpty: false, fake: 'widget_price_final' })
  readonly priceKey: string;

  /**
   * The product to match for. Optional. If set, this enrichment will only run for requests with a matching product.
   * If not set, this enrichment will run for any request matching the priceKey.
   * @example 96711b0a-abfd-456b-b928-6e2ea29a87ac
   */
  @StringProp({ optional: true, allowEmpty: false, fake: FAKE_UUID })
  readonly product: string | null;

  /**
   * The handler for this enricher. The handler must be defined in the price enricher service.
   * @example GET_DCF_COSTBOOK_LOCATION
   */
  @StringProp({ allowEmpty: false, fake: 'GET_DCF_COSTBOOK_LOCATION' })
  readonly handler: string;

  /**
   * A template which will be resolved and passed as arguments to the handler.
   * @example <%= priceRequest.dcfId %>
   */
  @Expose()
  @Type(() => SerializedDataDto)
  @Fake(['<%= priceRequest.dcfId %>'])
  @Validate(ValidSerializedData, { context: Errors.InvalidTemplate.context })
  paramTemplate: SerializedData;

  /**
   * A template which will be resolved with the result from the handler to determine the final result.
   * @example <%= result.name %>
   */
  @Expose()
  @Type(() => SerializedDataDto)
  @Fake('<%= result.name %>')
  @Validate(ValidSerializedData, { context: Errors.InvalidTemplate.context })
  resultTemplate: SerializedData;
}
