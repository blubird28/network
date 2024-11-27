import { IsISO8601 } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { FAKE_INSIGHT_REQUEST } from '@libs/nebula/testing/data/constants';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';

import StringProp from '../decorators/StringProp.decorator';
@DTOFaker()
export class InsightDetailsUpdateDto {
  @StringProp({
    optional: true,
    fake: FAKE_INSIGHT_REQUEST.salesRecordId,
  })
  @ApiProperty()
  readonly salesRecordId: string;

  @StringProp({
    optional: true,
    fake: FAKE_INSIGHT_REQUEST.serviceOrderId,
  })
  @ApiProperty()
  readonly serviceOrderId: string;

  @IsISO8601()
  @StringProp({
    allowEmpty: false,
    fake: FAKE_INSIGHT_REQUEST.contractStartDate,
    optional: true,
  })
  @ApiProperty()
  readonly contractStartDate: string;

  @IsISO8601()
  @StringProp({
    allowEmpty: false,
    fake: FAKE_INSIGHT_REQUEST.contractEndDate,
    optional: true,
  })
  @ApiProperty()
  readonly contractEndDate: string;
}
