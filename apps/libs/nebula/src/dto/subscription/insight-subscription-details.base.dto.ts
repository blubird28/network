import { Type } from 'class-transformer';
import { IsISO8601, ValidateNested } from 'class-validator';

import { FAKE_INSIGHT_REQUEST } from '@libs/nebula/testing/data/constants';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';

import ArrayProp from '../decorators/ArrayProp.decorator';
import { DeepFakeMany } from '../../testing/data/fakers';
import StringProp from '../decorators/StringProp.decorator';

import { SubscriptionRatingDetailDto } from './insight-subscription-rating-details.dto';
@DTOFaker()
export class InsightDetailsDto {
  @StringProp({
    allowEmpty: false,
    fake: FAKE_INSIGHT_REQUEST.orderId,
  })
  readonly orderId: string;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_INSIGHT_REQUEST.salesRecordId,
  })
  readonly salesRecordId: string;

  @StringProp({
    optional: true,
    fake: FAKE_INSIGHT_REQUEST.serviceOrderId,
  })
  readonly serviceOrderId?: string;

  @IsISO8601()
  @StringProp({
    allowEmpty: false,
    fake: FAKE_INSIGHT_REQUEST.contractStartDate,
  })
  readonly contractStartDate: string;

  @IsISO8601()
  @StringProp({
    allowEmpty: false,
    fake: FAKE_INSIGHT_REQUEST.contractEndDate,
    optional: true,
  })
  readonly contractEndDate: string;

  @DeepFakeMany(() => SubscriptionRatingDetailDto)
  @ArrayProp()
  @ValidateNested({ each: true })
  @Type(() => SubscriptionRatingDetailDto)
  insightRatingMethodDetails: SubscriptionRatingDetailDto[];
}
