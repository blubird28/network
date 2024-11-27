import { IsEnum } from 'class-validator';

import { RIR, RIRs } from '../../Network/constants';
import StringProp from '../decorators/StringProp.decorator';

import { SixconnectSmartAssignRequestDto } from './sixconnect-smart-assign-request.dto';

export class SixconnectSmartAssignRequestWithRirDto extends SixconnectSmartAssignRequestDto {
  /**
   * The registry to request the block from
   * @example ARIN
   */
  @StringProp({ fake: RIRs[0] }, IsEnum(RIR))
  rir: RIR;
}
