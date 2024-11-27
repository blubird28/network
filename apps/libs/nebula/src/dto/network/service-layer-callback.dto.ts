import { IsInt, IsPositive } from 'class-validator';

import { HttpStatus } from '@nestjs/common';

import NumberProp from '@libs/nebula/dto/decorators/NumberProp.decorator';
import StringProp from '@libs/nebula/dto/decorators/StringProp.decorator';

export class ServiceLayerCallbackDto {
  /**
   * The response code for the command being called back from
   * @example 200
   */
  @NumberProp({ fake: HttpStatus.OK }, IsPositive(), IsInt())
  code: number;
  /**
   * A message describing the result of the command being called back from
   * @example Success
   */
  @StringProp({ fake: 'Success' })
  message: string;
}
