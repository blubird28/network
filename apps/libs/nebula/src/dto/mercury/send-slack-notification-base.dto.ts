import StringProp from '../decorators/StringProp.decorator';
import { StringArrayProp } from '../decorators/ArrayProp.decorator';
import BooleanProp from '../decorators/BooleanProp.decorator';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';

@ExternalType()
@DTOFaker()
export class SendSlackNotificationBase {
  @StringProp({ allowEmpty: false, fake: 'A wild slack notification appears' })
  heading: string;

  @StringArrayProp({ fake: ['User: Fred'] })
  textLines: string[];

  @BooleanProp({ optional: true, fake: false })
  here?: boolean;

  @StringProp({ optional: true, fake: '#c9c9c9' })
  color?: string;
}
