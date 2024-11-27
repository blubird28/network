import StringProp, { MongoIDProp } from '../decorators/StringProp.decorator';
import { StringArrayProp } from '../decorators/ArrayProp.decorator';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ReferencedById } from '../../ReferenceBuilder/decorators';
import { ExternalType } from '../../utils/external-type';
import { FAKE_COSTBOOK_LOCATION_NAME } from '../../testing/data/constants';

@ExternalType()
@ReferencedById()
@DTOFaker()
export class LegacyCostbookLocation {
  @MongoIDProp()
  public readonly id: string;

  @StringProp({ fake: FAKE_COSTBOOK_LOCATION_NAME })
  public readonly name: string;

  @StringArrayProp({ fake: [] })
  public readonly tags: string[];
}
