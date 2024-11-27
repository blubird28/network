import { Expose, Type } from 'class-transformer';
import { IsEmail, IsMongoId, IsString } from 'class-validator';

import { Fake, FakeEmail, FakeObjectId } from '../../testing/data/fakers';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';

@ExternalType()
@DTOFaker()
export class BdmManagerDto {
  @Expose()
  @IsMongoId()
  @IsString()
  @Type(() => String)
  @FakeObjectId
  public readonly id: string;

  @Expose()
  @IsEmail()
  @Type(() => String)
  @FakeEmail()
  public readonly email: string;

  @Expose()
  @IsString()
  @Type(() => String)
  @Fake('test name')
  public readonly name: string;
}
