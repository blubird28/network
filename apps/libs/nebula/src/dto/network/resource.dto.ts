import { Type, Expose } from 'class-transformer';
import { IsObject, IsOptional, Validate } from 'class-validator';

import { SerializedObject } from '@libs/nebula/Serialization/serializes';
import { DeepFakeMany } from '@libs/nebula/testing/data/fakers';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import { ResourceIdDto } from '@libs/nebula/dto/network/resource-id.dto';

import StringProp, { UUIDv4Prop } from '../decorators/StringProp.decorator';
import ArrayProp from '../decorators/ArrayProp.decorator';
import {
  SerializedDataDto,
  ValidSerializedObject,
} from '../serialized-data.dto';
import Errors from '../../Error';

import { UsageDto } from './usage.dto';
import { CapabilityDto } from './capability.dto';

@DTOFaker()
export class ResourceDto extends ResourceIdDto {
  /**
   * The resource type
   * @example IOD_SITE
   */
  @StringProp({ fake: 'IOD_SITE' })
  type: string;

  /**
   * The source ID of the resource
   */
  @UUIDv4Prop()
  sourceId: string;

  /**
   * Usages linked to the resource
   */
  @ArrayProp()
  @DeepFakeMany(() => UsageDto, {})
  @Type(() => UsageDto)
  usages: UsageDto[];

  /**
   * Capabilities linked to the resource
   */
  @ArrayProp()
  @DeepFakeMany(() => CapabilityDto, {})
  @Type(() => CapabilityDto)
  capabilities: CapabilityDto[];

  /**
   * Additional metadata, including slPortUuid
   */
  @Expose()
  @IsOptional()
  @IsObject({ context: Errors.InvalidPayloadMatcher.context })
  @Type(() => SerializedDataDto)
  @Validate(ValidSerializedObject, {
    context: Errors.InvalidPayloadMatcher.context,
  })
  meta?: SerializedObject;
}
