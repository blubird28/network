import { Expose, Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

import { Fake, DeepFakeMany } from '../../testing/data/fakers';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';
import { SerializedDataDto } from '../serialized-data.dto';
import { MarketplaceOrderDto } from '../legacy-api/marketplace-order.dto';
import ArrayProp from '../decorators/ArrayProp.decorator';

@ExternalType()
@DTOFaker()
export class SubscriptionProductAttribute {
  @Fake({
    a_end_city: '<%=srcLocation?.dcf?.company?.addresses[0].city %>',
    a_end_country: '<%= srcLocation?.dcf?.company?.addresses[0].country %>',
  })
  @Type(() => SerializedDataDto)
  @ArrayProp({ optional: true })
  @Fake([{ name: 'a_end_country', value: '<%= data.country %>' }])
  productAttributeTemplate?: Record<string, string | number | boolean>[];

  @DeepFakeMany(() => MarketplaceOrderDto)
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MarketplaceOrderDto)
  order: MarketplaceOrderDto;
}
