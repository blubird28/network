import { IsEnum } from 'class-validator';

import StringProp from '../decorators/StringProp.decorator';
import NumberProp from '../decorators/NumberProp.decorator';

import { IpBlockType } from './assign-ip-block-request.dto';

export interface SixconnectSmartAssignRequestConfiguration {
  resource_id: number;
  assigned_resource_id: number;
  tags_mode: string;
  tags: string;
}

export class SixconnectSmartAssignRequestDto
  implements SixconnectSmartAssignRequestConfiguration
{
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

  /**
   * The sixconnect resource to request the block from
   * @example 12345
   */
  @NumberProp({ fake: 12345 })
  resource_id: number;

  /**
   * The sixconnect resource to assign the block to
   * @example 12345
   */
  @NumberProp({ fake: 23456 })
  assigned_resource_id: number;

  /**
   * Whether to compare requested tags in strict mode
   * @example strict
   */
  @StringProp({ fake: 'strict' })
  tags_mode: string;

  /**
   * Tags to filter assigned ip block for
   * @example Customer
   */
  @StringProp({ fake: 'Customer' })
  tags: string;
}
