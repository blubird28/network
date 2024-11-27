import { Expose, Type } from 'class-transformer';
import { IsObject, IsOptional, Validate } from 'class-validator';

import { SerializedObject } from '@libs/nebula/Serialization/serializes';

import StringProp, { UUIDv4Prop } from '../decorators/StringProp.decorator';
import NumberProp from '../decorators/NumberProp.decorator';
import {
  SerializedDataDto,
  ValidSerializedObject,
} from '../serialized-data.dto';
import Errors from '../../Error';

export class CapabilityDto {
  /**
   * The capability ID
   * @example uuid
   */
  @UUIDv4Prop()
  id: string;

  /**
   * The type of the capability
   * @example IP_ADDRESSES
   */
  @StringProp({ fake: 'IP_ADDRESSES' })
  type: string;

  /**
   * Limit of the capability
   */
  @NumberProp({ optional: true })
  limit: number | null;

  /**
   * Metadata related to the capability
   */
  @Expose()
  @IsOptional()
  @IsObject({ context: Errors.InvalidPayloadMatcher.context })
  @Type(() => SerializedDataDto)
  @Validate(ValidSerializedObject, {
    context: Errors.InvalidPayloadMatcher.context,
  })
  meta?: SerializedObject | null;
}
