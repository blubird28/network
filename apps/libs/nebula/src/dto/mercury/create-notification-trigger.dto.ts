import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';

import { ExternalType } from '../../utils/external-type';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { Fake } from '../../testing/data/fakers';
import Errors from '../../Error';
import {
  SerializedDataDto,
  ValidSerializedObject,
} from '../serialized-data.dto';
import { SerializedObject } from '../../Serialization/serializes';

@ExternalType()
@DTOFaker()
export class CreateNotificationTriggerDto {
  /**
   * The name of this trigger.
   * @example when order placed
   */
  @IsString()
  @IsNotEmpty()
  @Expose()
  @Fake('when order placed')
  @Type(() => String)
  readonly name: string;

  /**
   * The eventType to trigger on. Should exactly match the normalized form of the published message's pattern.
   * @example {"eventType":"USER_TASK_CREATED"}
   */
  @IsString()
  @IsNotEmpty()
  @Expose()
  @Fake('{"eventType":"USER_TASK_CREATED"}')
  @Type(() => String)
  readonly patternMatch: string;

  /**
   * Optional, the pattern to match on the event payload. If set, and a published event's payload does not match it, the trigger will not fire.
   * @example {"status": "ACTIVE"}
   */
  @Expose()
  @IsOptional()
  @IsObject({ context: Errors.InvalidPayloadMatcher.context })
  @Fake({ status: 'ACTIVE' })
  @Type(() => SerializedDataDto)
  @Validate(ValidSerializedObject, {
    context: Errors.InvalidPayloadMatcher.context,
  })
  payloadMatch?: SerializedObject;
}
