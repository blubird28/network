import StringProp, { UUIDv4Prop } from '../decorators/StringProp.decorator';

export class AssignIpBlockResponseDto {
  /**
   * The resource id
   * @example ipv4
   */
  @UUIDv4Prop()
  resourceId: string;

  /**
   * The assigned block's cidr
   * @example 10.0.0.1/31
   */
  @StringProp({ fake: '10.0.0.1/31' })
  cidr: string;
}
