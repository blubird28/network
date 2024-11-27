import { Expose, Type } from 'class-transformer';

import { FAKE_UUID } from '@libs/nebula/testing/data/constants';

import { UUIDv4Prop } from '../decorators/StringProp.decorator';
import { ExternalType } from '../../utils/external-type';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { Fake } from '../../testing/data/fakers';
import { SerializedDataDto } from '../serialized-data.dto';
import { SerializedObject } from '../../Serialization/serializes';

@ExternalType()
@DTOFaker()
export class EnrichedProductAttributesDto {
  /**
   * The id of the subscription product mapping which was matched
   */
  @UUIDv4Prop({ fake: FAKE_UUID, optional: true })
  productSpecificationId: string;

  /**
   * The resolved product attributes.
   * @example {"city": "Brisbane", "country": "Australia"}
   */
  @Expose()
  @Type(() => SerializedDataDto)
  @Fake([
    {
      name: 'a_end_country',
      value: 'GBR',
    },
  ])
  attributes: SerializedObject[];
}
