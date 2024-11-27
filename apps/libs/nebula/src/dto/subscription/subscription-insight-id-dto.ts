import { ApiProperty } from '@nestjs/swagger';

import { UUIDv4Prop } from '../decorators/StringProp.decorator';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';

@ExternalType()
@DTOFaker()
export class InsightSubscriptionIdDto {
  @UUIDv4Prop()
  @ApiProperty()
  readonly insightSubscriptionId: string;
}
