import { Expose, Type } from 'class-transformer';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { Fake, FakeUuid, FakeDate } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';

@ExternalType()
@DTOFaker()
export class CheckpointDto {
  @FakeUuid
  @Expose()
  @Type(() => String)
  readonly id: string;

  @FakeDate()
  @Expose()
  @Type(() => Date)
  public readonly createdAt: Date;

  @Fake('Remark')
  @Expose()
  @Type(() => String)
  readonly remark: string;
}
