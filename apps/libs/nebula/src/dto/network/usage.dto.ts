import { Expose, Type } from 'class-transformer';
import { IsObject, Validate } from 'class-validator';

import { SerializedObject } from '@libs/nebula/Serialization/serializes';

import StringProp, { UUIDv4Prop } from '../decorators/StringProp.decorator';
import NumberProp from '../decorators/NumberProp.decorator';
import {
  SerializedDataDto,
  ValidSerializedObject,
} from '../serialized-data.dto';
import Errors from '../../Error';

export class UsageDto {
  /**
   * The usage ID
   * @example uuid
   */
  @UUIDv4Prop()
  id: string;

  /**
   * The type of the usage
   * @example PUBLIC_IP
   */
  @StringProp({ fake: 'PUBLIC_IP' })
  type: string;

  /**
   * The amount used
   * @example 1
   */
  @NumberProp()
  amount: number | null;

  /**
   * Metadata related to the usage
   */
  @Expose()
  @IsObject({ context: Errors.InvalidPayloadMatcher.context })
  @Type(() => SerializedDataDto)
  @Validate(ValidSerializedObject, {
    context: Errors.InvalidPayloadMatcher.context,
  })
  meta: SerializedObject | null;
}
