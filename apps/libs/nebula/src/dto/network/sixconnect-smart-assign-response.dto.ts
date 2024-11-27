import StringProp from '../decorators/StringProp.decorator';
import NumberProp from '../decorators/NumberProp.decorator';

export class SixconnectSmartAssignResponseDto {
  /**
   * The sixconnect resource id of the assigned block
   * @example 12345
   */
  @NumberProp({ fake: 12345 })
  id: number;

  /**
   * The assigned block's cidr
   * @example 10.0.0.1/31
   */
  @StringProp({ fake: '10.0.0.1/31' })
  cidr: string;
}
