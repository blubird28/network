import StringProp from '../decorators/StringProp.decorator';

import { AssignIpBlockResponseDto } from './assign-ip-block-response.dto';

export class AssignLinknetIpBlockResponseDto extends AssignIpBlockResponseDto {
  /**
   * The IP address for the console router
   * @example 10.0.0.0
   */
  @StringProp({ fake: '10.0.0.0' })
  consoleRouterIp: string;

  /**
   * The IP address for the customer router
   * @example 10.0.0.1
   */
  @StringProp({ fake: '10.0.0.1' })
  customerRouterIp: string;
}
