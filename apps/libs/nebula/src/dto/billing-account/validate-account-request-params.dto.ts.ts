import { IsHexadecimal, IsNotEmpty, Length } from 'class-validator';
import { Expose, Type } from 'class-transformer';

import { FAKE_OBJECT_ID } from '@libs/nebula/testing/data/constants';
import { LENGTH_24 } from '@libs/nebula/billing-account/billing-account.constants';

import Errors from '../../Error';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { Fake } from '../../testing/data/fakers';

@DTOFaker()
export class ValidateAccountRequestParamsDto {
  @Fake(FAKE_OBJECT_ID)
  @Expose()
  @Length(LENGTH_24, LENGTH_24)
  @IsHexadecimal()
  @Type(() => String)
  @IsNotEmpty({ context: Errors.InvalidBillingCompanyId.context })
  readonly companyId: string;
}
