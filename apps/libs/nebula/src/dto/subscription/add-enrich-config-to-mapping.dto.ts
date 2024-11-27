import { Validate } from 'class-validator';
import { Expose, Type } from 'class-transformer';

import ArrayProp from '../decorators/ArrayProp.decorator';
import { ExternalType } from '../../utils/external-type';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { DeepFakeMany, Fake } from '../../testing/data/fakers';
import {
  SerializedDataDto,
  ValidSerializedObject,
} from '../serialized-data.dto';
import Errors from '../../Error';

import { SubscriptionAttributeEnricherConfigBaseDto } from './subscription-attribute-enricher-config-base.dto';

@ExternalType()
@DTOFaker()
export class AddEnrichConfigToMappingDto {
  /**
   * The enrichers to set up for the mapping. These will fetch any required data to determine product attributes
   */
  @DeepFakeMany(() => SubscriptionAttributeEnricherConfigBaseDto, {})
  @ArrayProp()
  @Type(() => SubscriptionAttributeEnricherConfigBaseDto)
  enrichers: SubscriptionAttributeEnricherConfigBaseDto[];

  /**
   * A template which will be resolved to mapped product attributes.
   * @example {"city": "<%= datacenterFacility.city %>", "country": "<%= datacenterFacility.country %>"}
   */
  @Expose()
  @Type(() => SerializedDataDto)
  @Fake({
    city: '<%= datacenterFacility.city %>',
    country: '<%= datacenterFacility.country %>',
  })
  @Validate(ValidSerializedObject, { context: Errors.InvalidTemplate.context })
  productAttributeTemplate: Record<string, string | number | boolean>[];
}
