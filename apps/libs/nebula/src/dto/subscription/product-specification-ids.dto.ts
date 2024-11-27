import { IsV4UUID } from '@libs/nebula/utils/decorators/isV4UUID.decorator';
import { FAKE_UUID } from '@libs/nebula/testing/data/constants';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';
import { StringArrayProp } from '../decorators/ArrayProp.decorator';

@ExternalType()
@DTOFaker()
export class ProductSpecificationIdsDto {
  @StringArrayProp({ fake: [FAKE_UUID] }, IsV4UUID({ each: true }))
  readonly ccProductSpecificationIds: string[];
}
