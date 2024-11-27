import { IsIP } from 'class-validator';

import { StringArrayProp } from '@libs/nebula/dto/decorators/ArrayProp.decorator';
import {
  FAKE_IP_V4_PREFIX,
  FAKE_IP_V6_PREFIX,
} from '@libs/nebula/testing/data/constants';

export class PrefixLookupResponseDto {
  /**
   * The allowed ipv4 prefixes for this ASN/AS-set
   * @example 10.1.1.1/24
   */
  @StringArrayProp({ fake: [FAKE_IP_V4_PREFIX] }, IsIP('4'))
  ipv4: string[];

  /**
   * The allowed ipv6 prefixes for this ASN/AS-set
   * @example 2400:8800::/32
   */
  @StringArrayProp({ fake: [FAKE_IP_V6_PREFIX] }, IsIP('6'))
  ipv6: string[];
}
