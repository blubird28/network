import { IsNotEmpty, IsUUID } from 'class-validator';
import { Expose, Type } from 'class-transformer';

import Errors from '../Error';
import { DTOFaker } from '../testing/data/fakers/decorators/Faker';
import { FakeUuid } from '../testing/data/fakers';
import { ReferencedBy } from '../ReferenceBuilder/decorators';
import { ExternalType } from '../utils/external-type';

@ExternalType()
@ReferencedBy<CompanyIdDto>(({ companyId }) => `companyId: ${companyId}`)
@DTOFaker()
export class CompanyIdDto {
  /**
   * The company ID to look up
   * @example 96711b0a-abfd-456b-b928-6e2ea29a87ac
   */
  @FakeUuid
  @Expose()
  @Type(() => String)
  @IsUUID(4, { context: Errors.InvalidCompanyId.context })
  @IsNotEmpty({ context: Errors.InvalidCompanyId.context })
  readonly companyId: string;
}
