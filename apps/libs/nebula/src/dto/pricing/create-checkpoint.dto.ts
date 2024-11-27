import { IsOptional, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';

import { Fake } from '../../testing/data/fakers';
export class CreateCheckpointDto {
  @Fake('Initial')
  @Expose()
  @IsString()
  @IsOptional()
  @Type(() => String)
  readonly remark?: string;
}
