import { IsEnum } from 'class-validator';

import StringProp from '../decorators/StringProp.decorator';
import NumberProp from '../decorators/NumberProp.decorator';

export enum IpBlockType {
  ipv4 = 'ipv4',
  ipv6 = 'ipv6',
}

export class AssignIpBlockRequestDto {
  /**
   * The type of ip address to assign (ipv4 or ipv6)
   * @example ipv4
   */
  @StringProp({ fake: IpBlockType.ipv4 }, IsEnum(IpBlockType))
  type: IpBlockType;

  /**
   * The subnet mask size to assign, as a number of masked bits
   * @example 28
   */
  @NumberProp({ fake: 28 })
  mask: number;
}
